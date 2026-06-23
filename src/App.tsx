import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  Check, 
  Sun, 
  Moon, 
  RotateCcw, 
  Save, 
  FolderOpen, 
  Calculator, 
  Search, 
  Eye, 
  Info, 
  PlusCircle, 
  X,
  Wrench
} from 'lucide-react';
import { productsDb } from './productsDb';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';

// Interface for item state
interface ProposalItemState {
  id: string;
  included: boolean;
  qty: number;
  price: number;
  discount: number;
  marka: string;
  sorumlu: string;
  unit: string;
  name: string;
  description: string;
  categoryName: string;
  sheetName: string;
  isAutoCalculated?: boolean;
  factor?: number;
}

interface ClientInfo {
  customerName: string;
  projectName: string;
  proposalNo: string;
  date: string;
  validUntil: string;
  preparedBy: string;
}

interface SavedTemplate {
  id: string;
  name: string;
  timestamp: string;
  clientInfo: ClientInfo;
  currency: string;
  kdvRate: number;
  kdvIncluded: boolean;
  itemsState: Record<string, ProposalItemState>;
  notes: string[];
  customItems?: ProposalItemState[];
  customTabs?: string[];
  proposalType?: 'detailed' | 'simple';
  simpleScopeItems?: string[];
  simplePricing?: {
    unitLabel: string;
    unitPrice: number;
    quantity: number;
    subDetails: string;
  };
  simplePayment?: string;
  simpleSalutation?: string;
  simpleProjectTypeText?: string;
}

// Helper function to crop whitespace from the canvas
function cropCanvasWhitespace(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const context = canvas.getContext('2d');
  if (!context) return canvas;

  const width = canvas.width;
  const height = canvas.height;
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let foundAnyContent = false;

  // Scan all pixels to find bounds of non-white & non-transparent pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];

      // White pixel check (RGB values close to 255)
      // Transparent check (alpha channel close to 0)
      const isWhite = r > 240 && g > 240 && b > 240;
      const isTransparent = a < 20;

      if (!isWhite && !isTransparent) {
        foundAnyContent = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!foundAnyContent || maxX < minX || maxY < minY) {
    return canvas;
  }

  // Add a larger padding (30px) for safe margins to avoid clipping
  const padding = 30;
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width, maxX + padding);
  maxY = Math.min(height, maxY + padding);

  const croppedWidth = maxX - minX;
  const croppedHeight = maxY - minY;

  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = croppedWidth;
  croppedCanvas.height = croppedHeight;
  const croppedContext = croppedCanvas.getContext('2d');
  if (!croppedContext) return canvas;

  croppedContext.drawImage(canvas, minX, minY, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);
  return croppedCanvas;
}

export default function App() {
  // App states
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<string>("SIHHİ TESİSAT");
  const [currency, setCurrency] = useState<string>("TRY");
  const [kdvRate, setKdvRate] = useState<number>(20);
  const [kdvIncluded, setKdvIncluded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showOnlySelected, setShowOnlySelected] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'danger' } | null>(null);

  // Logo URL rendered from logo.pdf
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Simple proposal state variables
  const [proposalType, setProposalType] = useState<'detailed' | 'simple'>('detailed');
  const [simpleScopeItems, setSimpleScopeItems] = useState<string[]>([
    "SIHHİ TESİSAT (PPRC, PVC, OTOPARK ALT TOPLAMA, YAĞMUR SUYU İNİŞLERİ)",
    "YERDEN ISITMA",
    "DOĞALGAZ ANA KOLON HATTI (PROJE DAHİL)",
    "DAİRE İÇİ DOĞALGAZ TESİSATI",
    "VİTRİFİYE MONTAJ İŞÇİLİK",
    "KAROTLA DELİK DELME"
  ]);
  const [newScopeItem, setNewScopeItem] = useState<string>("");
  const [simplePricing, setSimplePricing] = useState({
    unitLabel: "1 DAİRE FİYATI",
    unitPrice: 250000,
    quantity: 13,
    subDetails: "10 DÜKKAN (3 DAİRE)\nTOPLAM 13 DAİRE"
  });
  const [simplePayment, setSimplePayment] = useState<string>("KARŞILIKLI GÖRÜŞÜLECEKTİR.");
  const [simpleSalutation, setSimpleSalutation] = useState<string>("SAYIN YETKİLİ");
  const [simpleProjectTypeText, setSimpleProjectTypeText] = useState<string>("VİLLA PROJENİZİN");

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
          console.log("Waiting for PDF.js to load...");
          return;
        }
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        const loadingTask = pdfjsLib.getDocument('./logo_yeni.pdf');
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;
        
        const scale = 3; // High-res rendering scale
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        // Crop empty white space margins from the canvas page
        const croppedCanvas = cropCanvasWhitespace(canvas);
        const dataUrl = croppedCanvas.toDataURL('image/png');
        setLogoUrl(dataUrl);
      } catch (err) {
        console.error("Error loading logo.pdf: ", err);
      }
    };
    
    // Check repeatedly if pdfjsLib is available or run on mount
    const checkInterval = setInterval(() => {
      if ((window as any).pdfjsLib) {
        loadLogo();
        clearInterval(checkInterval);
      }
    }, 100);
    
    return () => clearInterval(checkInterval);
  }, []);
  
  // Client Info state
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    customerName: "Ercan İnşaat A.Ş.",
    projectName: "BOLLUCA VİLLALARI",
    proposalNo: "EM-" + new Date().getFullYear() + "-" + String(Math.floor(100 + Math.random() * 900)),
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    preparedBy: "E MEKANİK MÜHENDİSLİK LTD. ŞTİ."
  });

  // Notes state
  const [notes, setNotes] = useState<string[]>([
    "Fiyatlarımıza KDV dâhil değildir.",
    "İnşai işlemler (kırım, harç, sıva vb.) İşveren'e aittir.",
    "Gerekli elektrik tesisatı ve besleme hatları İşveren tarafından yapılacaktır.",
    "Ödeme şartları: Karşılıklı görüşülüp sözleşmede belirlenecektir."
  ]);
  const [newNote, setNewNote] = useState<string>("");

  // Items State (initialized on demand or loaded)
  const [itemsState, setItemsState] = useState<Record<string, ProposalItemState>>({});
  
  // Custom items added by the user
  const [customItems, setCustomItems] = useState<ProposalItemState[]>([]);
  
  // Custom categories/tabs added by the user
  const [customTabs, setCustomTabs] = useState<string[]>([]);
  
  // Templates state
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [saveTemplateName, setSaveTemplateName] = useState<string>("");

  // Loading indicator for PDF rendering
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);

  // Custom Item Form state
  const [customItemForm, setCustomItemForm] = useState({
    name: "",
    category: "Genel",
    unit: "Adet",
    qty: 1,
    price: 0,
    discount: 0,
    marka: "",
    sorumlu: "YÜKLENİCİ",
    description: ""
  });

  // Initialize DB items state
  useEffect(() => {
    const initialState: Record<string, ProposalItemState> = {};
    productsDb.forEach(sheet => {
      sheet.categories.forEach(cat => {
        cat.items.forEach(item => {
          initialState[item.id] = {
            id: item.id,
            included: true,
            qty: item.defaultQty,
            price: item.fiyat || 0,
            discount: 0,
            marka: item.marka,
            sorumlu: item.sorumlu,
            unit: item.unit,
            name: item.name,
            description: item.description || "",
            categoryName: cat.name,
            sheetName: sheet.name,
            isAutoCalculated: item.factor !== undefined,
            factor: item.factor
          };
        });
      });
    });
    
    // Load from localStorage if present
    const saved = localStorage.getItem('em_current_proposal');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.itemsState) {
          // Merge saved state over initial state to handle any code/db updates
          const merged = { ...initialState, ...parsed.itemsState };
          setItemsState(merged);
        } else {
          setItemsState(initialState);
        }
        if (parsed.clientInfo) setClientInfo(parsed.clientInfo);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.kdvRate !== undefined) setKdvRate(parsed.kdvRate);
        if (parsed.kdvIncluded !== undefined) setKdvIncluded(parsed.kdvIncluded);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.customItems) setCustomItems(parsed.customItems);
        if (parsed.proposalType) setProposalType(parsed.proposalType);
        if (parsed.simpleScopeItems) setSimpleScopeItems(parsed.simpleScopeItems);
        if (parsed.simplePricing) setSimplePricing(parsed.simplePricing);
        if (parsed.simplePayment) setSimplePayment(parsed.simplePayment);
        if (parsed.simpleSalutation) setSimpleSalutation(parsed.simpleSalutation);
        if (parsed.simpleProjectTypeText) setSimpleProjectTypeText(parsed.simpleProjectTypeText);
        if (parsed.customTabs) setCustomTabs(parsed.customTabs);
      } catch (e) {
        setItemsState(initialState);
      }
    } else {
      setItemsState(initialState);
    }

    // Load templates list
    const templates = localStorage.getItem('em_proposal_templates');
    if (templates) {
      try {
        setSavedTemplates(JSON.parse(templates));
      } catch (e) {}
    }
  }, []);

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Save progress locally auto
  useEffect(() => {
    if (Object.keys(itemsState).length > 0) {
      const dataToSave = {
        clientInfo,
        currency,
        kdvRate,
        kdvIncluded,
        itemsState,
        notes,
        customItems,
        proposalType,
        simpleScopeItems,
        simplePricing,
        simplePayment,
        simpleSalutation,
        simpleProjectTypeText,
        customTabs
      };
      localStorage.setItem('em_current_proposal', JSON.stringify(dataToSave));
    }
  }, [
    clientInfo, currency, kdvRate, kdvIncluded, itemsState, notes, customItems,
    proposalType, simpleScopeItems, simplePricing, simplePayment, simpleSalutation, simpleProjectTypeText,
    customTabs
  ]);

  // Toast helper
  const showToast = (msg: string, type: 'success' | 'danger' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Currency symbols map
  // Tab list (default + custom)
  const allTabs = useMemo(() => {
    const dbTabs = productsDb.map(sheet => sheet.name);
    return [...dbTabs, ...customTabs];
  }, [customTabs]);

  const currencySymbol = useMemo(() => {
    switch (currency) {
      case "USD": return "$";
      case "EUR": return "€";
      default: return "₺";
    }
  }, [currency]);


  // Automated computations
  const calculatedItems = useMemo(() => {
    const itemsMap = { ...itemsState };
    const customItemsMap = [...customItems];
    
    // Helper to calculate total for a specific item ID (normal items only to avoid circular dep)
    const getNormalItemTotal = (id: string, customList: ProposalItemState[]) => {
      const dbItem = itemsMap[id];
      if (dbItem && dbItem.included && !dbItem.isAutoCalculated) {
        return dbItem.qty * dbItem.price * (1 - dbItem.discount / 100);
      }
      const custItem = customList.find(c => c.id === id);
      if (custItem && custItem.included && !custItem.isAutoCalculated) {
        return custItem.qty * custItem.price * (1 - custItem.discount / 100);
      }
      return 0;
    };

    // Calculate PPRC Pipe subtotal (db item IDs)
    const pprcIds = ["sihhi-pprc-20", "sihhi-pprc-25", "sihhi-pprc-32", "sihhi-pprc-40", "sihhi-pprc-50"];
    const pprcMaterialSubtotal = pprcIds.reduce((sum, id) => sum + getNormalItemTotal(id, customItemsMap), 0);
    
    // Calculate PVC Pipe subtotal
    const pvcIds = ["sihhi-pvc-50", "sihhi-pvc-70", "sihhi-pvc-100", "sihhi-pvc-125", "sihhi-pvc-150"];
    const pvcMaterialSubtotal = pvcIds.reduce((sum, id) => sum + getNormalItemTotal(id, customItemsMap), 0);

    // Calculate Doğalgaz Pipe subtotal
    const dogalgazIds = ["dogalgaz-boru-25", "dogalgaz-boru-32", "dogalgaz-boru-40", "dogalgaz-boru-50"];
    const dogalgazMaterialSubtotal = dogalgazIds.reduce((sum, id) => sum + getNormalItemTotal(id, customItemsMap), 0);

    // Return mapped items with their final prices
    const finalItems: Record<string, ProposalItemState & { itemTotal: number }> = {};
    
    // Loop DB items
    Object.keys(itemsMap).forEach(id => {
      const item = itemsMap[id];
      let itemTotal = 0;
      let calculatedPrice = item.price;
      
      if (item.included) {
        if (item.isAutoCalculated) {
          // Automatic mechanical pipe fitting fee computation
          if (id === "sihhi-pprc-montaj") {
            itemTotal = pprcMaterialSubtotal * (item.factor || 0.45);
            calculatedPrice = pprcMaterialSubtotal > 0 ? itemTotal / item.qty : 0;
          } else if (id === "sihhi-pvc-montaj") {
            itemTotal = pvcMaterialSubtotal * (item.factor || 0.65);
            calculatedPrice = pvcMaterialSubtotal > 0 ? itemTotal / item.qty : 0;
          } else if (id === "dogalgaz-boru-montaj") {
            itemTotal = dogalgazMaterialSubtotal * (item.factor || 0.45);
            calculatedPrice = dogalgazMaterialSubtotal > 0 ? itemTotal / item.qty : 0;
          } else {
            itemTotal = item.qty * item.price * (1 - item.discount / 100);
          }
        } else {
          itemTotal = item.qty * item.price * (1 - item.discount / 100);
        }
      }
      
      finalItems[id] = {
        ...item,
        price: Number(calculatedPrice.toFixed(2)),
        itemTotal: Number(itemTotal.toFixed(2))
      };
    });

    // Handle custom items (if any auto calculated custom items are added in future, calculate here)
    const finalCustomItems = customItemsMap.map(item => {
      const itemTotal = item.included ? (item.qty * item.price * (1 - item.discount / 100)) : 0;
      return {
        ...item,
        itemTotal: Number(itemTotal.toFixed(2))
      };
    });

    return {
      dbItems: finalItems,
      customItems: finalCustomItems
    };
  }, [itemsState, customItems]);

  // Compute final financial stats
  const financials = useMemo(() => {
    if (proposalType === 'simple') {
      const subtotalBeforeDiscount = simplePricing.unitPrice * simplePricing.quantity;
      const totalDiscountAmount = 0;
      const netSubtotal = subtotalBeforeDiscount;
      let kdvAmount = 0;
      
      if (kdvIncluded) {
        kdvAmount = netSubtotal - (netSubtotal / (1 + kdvRate / 100));
      } else {
        kdvAmount = netSubtotal * (kdvRate / 100);
      }
      
      const grandTotal = kdvIncluded ? netSubtotal : (netSubtotal + kdvAmount);
      
      return {
        subtotalBeforeDiscount,
        totalDiscountAmount,
        netSubtotal,
        kdvAmount,
        grandTotal
      };
    }

    let subtotalBeforeDiscount = 0;
    let totalDiscountAmount = 0;
    
    // Sum from DB items
    Object.values(calculatedItems.dbItems).forEach(item => {
      if (item.included) {
        const rawTotal = item.qty * item.price;
        subtotalBeforeDiscount += rawTotal;
        totalDiscountAmount += rawTotal * (item.discount / 100);
      }
    });

    // Sum from Custom items
    calculatedItems.customItems.forEach(item => {
      if (item.included) {
        const rawTotal = item.qty * item.price;
        subtotalBeforeDiscount += rawTotal;
        totalDiscountAmount += rawTotal * (item.discount / 100);
      }
    });

    const netSubtotal = subtotalBeforeDiscount - totalDiscountAmount;
    let kdvAmount = 0;
    
    if (kdvIncluded) {
      // VAT is already included in prices: Net Subtotal is the total including VAT
      kdvAmount = netSubtotal - (netSubtotal / (1 + kdvRate / 100));
    } else {
      // VAT added afterwards
      kdvAmount = netSubtotal * (kdvRate / 100);
    }

    const grandTotal = kdvIncluded ? netSubtotal : (netSubtotal + kdvAmount);

    return {
      subtotalBeforeDiscount,
      totalDiscountAmount,
      netSubtotal,
      kdvAmount,
      grandTotal
    };
  }, [calculatedItems, kdvRate, kdvIncluded, proposalType, simplePricing]);

  // Filter items based on active tab and search query
  const filteredProductsDb = useMemo(() => {
    return productsDb.map(sheet => {
      if (sheet.name !== activeTab) return null;

      const cleanCategories = sheet.categories.map(cat => {
        const filteredItems = cat.items.map(item => {
          const itemState = calculatedItems.dbItems[item.id];
          if (!itemState) return null;

          // Apply filters
          if (showOnlySelected && !itemState.included) return null;
          
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesName = itemState.name.toLowerCase().includes(query);
            const matchesDesc = itemState.description.toLowerCase().includes(query);
            const matchesMarka = itemState.marka.toLowerCase().includes(query);
            if (!matchesName && !matchesDesc && !matchesMarka) return null;
          }

          return itemState;
        }).filter(Boolean) as (ProposalItemState & { itemTotal: number })[];

        return {
          ...cat,
          items: filteredItems
        };
      }).filter(cat => cat.items.length > 0);

      return {
        ...sheet,
        categories: cleanCategories
      };
    }).filter(Boolean)[0] as { name: string; categories: { name: string; items: (ProposalItemState & { itemTotal: number })[] }[] } | undefined;
  }, [activeTab, searchQuery, showOnlySelected, calculatedItems]);

  // Custom items for the current active tab
  const activeTabCustomItems = useMemo(() => {
    return calculatedItems.customItems.filter(item => {
      if (item.sheetName !== activeTab) return false;
      if (showOnlySelected && !item.included) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(query) || item.marka.toLowerCase().includes(query);
      }
      return true;
    });
  }, [activeTab, searchQuery, showOnlySelected, calculatedItems]);

  // Formatter helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency === 'TRY' ? 'TRY' : currency === 'USD' ? 'USD' : 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val).replace("TRY", "TL");
  };

  // Input Handlers
  const handleItemPropChange = (id: string, key: keyof ProposalItemState, value: any, isCustom: boolean = false) => {
    if (isCustom) {
      setCustomItems(prev => prev.map(item => {
        if (item.id === id) {
          return { ...item, [key]: value };
        }
        return item;
      }));
    } else {
      setItemsState(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [key]: value
        }
      }));
    }
  };

  // Select/Deselect Category Items
  const handleToggleCategory = (categoryName: string, include: boolean) => {
    setItemsState(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(id => {
        const item = updated[id];
        if (item.sheetName === activeTab && item.categoryName === categoryName) {
          updated[id] = { ...item, included: include };
        }
      });
      return updated;
    });
  };

  // Add custom note
  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes(prev => [...prev, newNote.trim()]);
      setNewNote("");
      showToast("Yeni teklif notu eklendi.");
    }
  };

  // Delete note
  const handleDeleteNote = (index: number) => {
    setNotes(prev => prev.filter((_, i) => i !== index));
    showToast("Teklif notu silindi.", "danger");
  };

  // Add custom item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemForm.name.trim()) return;

    const newItem: ProposalItemState = {
      id: `custom-${Date.now()}`,
      name: customItemForm.name.trim(),
      sheetName: activeTab,
      categoryName: customItemForm.category,
      unit: customItemForm.unit,
      qty: Number(customItemForm.qty),
      price: Number(customItemForm.price),
      discount: Number(customItemForm.discount),
      marka: customItemForm.marka.trim(),
      sorumlu: customItemForm.sorumlu,
      description: customItemForm.description.trim(),
      included: true
    };

    setCustomItems(prev => [...prev, newItem]);
    setCustomItemForm({
      name: "",
      category: "Genel",
      unit: "Adet",
      qty: 1,
      price: 0,
      discount: 0,
      marka: "",
      sorumlu: "YÜKLENİCİ",
      description: ""
    });
    showToast(`"${newItem.name}" teklife eklendi.`);
  };

  // Delete Custom Item
  const handleDeleteCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
    showToast("Özel ürün silindi.", "danger");
  };

  // Add custom tab
  const handleAddNewTab = () => {
    const name = window.prompt("Yeni Teklif Sekmesi / Kategori Adı girin (Örn: YANGIN TESİSATI, HAVALANDIRMA):");
    if (name && name.trim()) {
      const cleanName = name.trim().toUpperCase();
      if (allTabs.includes(cleanName)) {
        alert("Bu isimde bir kategori zaten mevcut!");
        return;
      }
      setCustomTabs(prev => [...prev, cleanName]);
      setActiveTab(cleanName);
      showToast(`"${cleanName}" kategorisi eklendi.`);
    }
  };

  // Delete custom tab
  const handleDeleteCustomTab = (tabName: string) => {
    const hasItems = customItems.some(item => item.sheetName === tabName);
    if (hasItems) {
      if (!window.confirm(`"${tabName}" kategorisi içerisinde eklenmiş özel ürünler bulunuyor. Kategoriyi ve içindeki tüm ürünleri silmek istediğinize emin misiniz?`)) {
        return;
      }
    }
    setCustomTabs(prev => prev.filter(t => t !== tabName));
    setCustomItems(prev => prev.filter(item => item.sheetName !== tabName));
    setActiveTab("SIHHİ TESİSAT");
    showToast(`"${tabName}" kategorisi silindi.`, "danger");
  };

  // Reset all state to defaults
  const handleResetForm = () => {
    if (window.confirm("Tüm teklif verilerini sıfırlamak istediğinize emin misiniz?")) {
      localStorage.removeItem('em_current_proposal');
      setCustomItems([]);
      setCustomTabs([]);
      setNotes([
        "Fiyatlarımıza KDV dâhil değildir.",
        "İnşai işlemler (kırım, harç, sıva vb.) İşveren'e aittir.",
        "Gerekli elektrik tesisatı ve besleme hatları İşveren tarafından yapılacaktır.",
        "Ödeme şartları: Karşılıklı görüşülüp sözleşmede belirlenecektir."
      ]);
      setItemsState(prev => {
        const reset: Record<string, ProposalItemState> = {};
        Object.keys(prev).forEach(id => {
          const item = prev[id];
          reset[id] = {
            ...item,
            included: true,
            qty: item.qty,
            price: 0,
            discount: 0
          };
        });
        return reset;
      });
      showToast("Tüm teklif sıfırlandı.", "danger");
    }
  };

  // Save proposal as template
  const handleSaveTemplate = () => {
    if (!saveTemplateName.trim()) {
      showToast("Lütfen şablon için bir isim girin.", "danger");
      return;
    }

    const newTemplate: SavedTemplate = {
      id: `template-${Date.now()}`,
      name: saveTemplateName.trim(),
      timestamp: new Date().toLocaleString('tr-TR'),
      clientInfo,
      currency,
      kdvRate,
      kdvIncluded,
      itemsState,
      notes,
      customItems,
      customTabs,
      proposalType,
      simpleScopeItems,
      simplePricing,
      simplePayment,
      simpleSalutation,
      simpleProjectTypeText
    };

    const updated = [...savedTemplates, newTemplate];
    setSavedTemplates(updated);
    localStorage.setItem('em_proposal_templates', JSON.stringify(updated));
    setSaveTemplateName("");
    showToast(`"${newTemplate.name}" şablonu kaydedildi.`);
  };

  // Load template
  const handleLoadTemplate = (tpl: SavedTemplate) => {
    if (window.confirm(`"${tpl.name}" şablonunu yüklemek istiyor musunuz? Geçerli çalışma verileriniz silinecektir.`)) {
      setClientInfo(tpl.clientInfo);
      setCurrency(tpl.currency);
      setKdvRate(tpl.kdvRate);
      setKdvIncluded(tpl.kdvIncluded);
      setItemsState(tpl.itemsState);
      setNotes(tpl.notes);
      setCustomItems(tpl.customItems || []);
      setCustomTabs(tpl.customTabs || []);
      setProposalType(tpl.proposalType || 'detailed');
      setSimpleScopeItems(tpl.simpleScopeItems || [
        "SIHHİ TESİSAT (PPRC, PVC, OTOPARK ALT TOPLAMA, YAĞMUR SUYU İNİŞLERİ)",
        "YERDEN ISITMA",
        "DOĞALGAZ ANA KOLON HATTI (PROJE DAHİL)",
        "DAİRE İÇİ DOĞALGAZ TESİSATI",
        "VİTRİFİYE MONTAJ İŞÇİLİK",
        "KAROTLA DELİK DELME"
      ]);
      setSimplePricing(tpl.simplePricing || {
        unitLabel: "1 DAİRE FİYATI",
        unitPrice: 250000,
        quantity: 13,
        subDetails: "10 DÜKKAN (3 DAİRE)\nTOPLAM 13 DAİRE"
      });
      setSimplePayment(tpl.simplePayment || "KARŞILIKLI GÖRÜŞÜLECEKTİR.");
      setSimpleSalutation(tpl.simpleSalutation || "SAYIN YETKİLİ");
      setSimpleProjectTypeText(tpl.simpleProjectTypeText || "VİLLA PROJENİZİN");
      showToast(`"${tpl.name}" şablonu başarıyla yüklendi.`);
    }
  };

  // Delete template
  const handleDeleteTemplate = (id: string, name: string) => {
    if (window.confirm(`"${name}" şablonunu silmek istediğinize emin misiniz?`)) {
      const updated = savedTemplates.filter(t => t.id !== id);
      setSavedTemplates(updated);
      localStorage.setItem('em_proposal_templates', JSON.stringify(updated));
      showToast("Şablon silindi.", "danger");
    }
  };

  // Pagination algorithm for A4 PDF layout
  const pdfPagesData = useMemo(() => {
    if (proposalType === 'simple') {
      return {
        chunks: [],
        hasSeparateSummaryPage: false,
        totalPages: 1
      };
    }
    // Gather all active items (DB + Custom) that are marked as included
    const activeDb = Object.values(calculatedItems.dbItems).filter(item => item.included);
    const activeCustom = calculatedItems.customItems.filter(item => item.included);
    const totalActive = [...activeDb, ...activeCustom];

    // Safe, fixed items limit per page to prevent text wrap overflows
    const itemsPerPage = 8;
    const itemChunks: (ProposalItemState & { itemTotal: number })[][] = [];
    
    for (let i = 0; i < totalActive.length; i += itemsPerPage) {
      itemChunks.push(totalActive.slice(i, i + itemsPerPage));
    }

    const lastPageItemsCount = itemChunks.length > 0 ? itemChunks[itemChunks.length - 1].length : 0;
    // If the last page has 3 or fewer items, the summary fits on the same page.
    const lastChunkFitsSummary = itemChunks.length > 0 && lastPageItemsCount <= 3;
    
    return {
      chunks: itemChunks,
      hasSeparateSummaryPage: !lastChunkFitsSummary,
      totalPages: 1 + itemChunks.length + (lastChunkFitsSummary ? 0 : 1) // Cover + Chunks + Summary (if separate)
    };
  }, [calculatedItems, proposalType]);

  // Helper to get correct starting index for numbering across pages
  const getChunkStartIndex = (chunkIdx: number) => {
    let start = 0;
    for (let i = 0; i < chunkIdx; i++) {
      if (pdfPagesData.chunks[i]) {
        start += pdfPagesData.chunks[i].length;
      }
    }
    return start;
  };

  // PDF Export Trigger
  const handleDownloadPDF = async () => {
    setPdfGenerating(true);
    showToast("PDF dosyası oluşturuluyor, lütfen bekleyin...");
    
    // A slight delay to ensure browser finishes layouts
    await new Promise(resolve => setTimeout(resolve, 800));

    const pages = document.querySelectorAll('.a4-page');
    if (pages.length === 0) {
      setPdfGenerating(false);
      showToast("Hata: PDF şablonu bulunamadı.", "danger");
      return;
    }

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i] as HTMLElement;
        const canvas = await html2canvas(pageEl, {
          scale: 2, // High resolution scale
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1200,
          windowHeight: 1600
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }

      const safeProjectName = clientInfo.projectName.replace(/[^a-zA-Z0-9]/g, "_");
      pdf.save(`E_Mekanik_Teklif_${safeProjectName}.pdf`);
      showToast("PDF başarıyla indirildi.");
    } catch (error) {
      console.error(error);
      showToast("PDF oluşturulurken bir hata oluştu.", "danger");
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div className="app-container">
      {/* Toast Message */}
      {toast && (
        <div className={`toast-msg ${toast.type === 'danger' ? 'danger' : ''}`}>
          <Check size={18} />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="main-header">
        <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {logoUrl ? (
            <img src={logoUrl} alt="E Mekanik" style={{ height: '78px', objectFit: 'contain' }} />
          ) : (
            <>
              <Wrench size={32} strokeWidth={2.5} />
              <div className="logo-text">
                <h1>E MEKANİK</h1>
                <p>Mekanik Tesisat Çözümleri</p>
              </div>
            </>
          )}
        </div>

        <div className="header-controls">
          {/* Currency selector */}
          <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ margin: 0, fontSize: '0.75rem' }}>Döviz</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="form-select"
              style={{ width: '90px', padding: '0.4rem 0.5rem' }}
            >
              <option value="TRY">TL (₺)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          {/* Theme switcher */}
          <button 
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="icon-btn"
            title="Tema Değiştir"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="dashboard-grid animate-fade-in">
        {/* Sidebar: Meta Forms & Controls */}
        <section className="sidebar">
          {/* Client Details panel */}
          <div className="glass-panel">
            <h3 className="panel-title">
              <FileText size={18} />
              Teklif Bilgileri
            </h3>
            
            <div className="form-group">
              <label>Müşteri / Firma Adı</label>
              <input 
                type="text"
                value={clientInfo.customerName}
                onChange={(e) => setClientInfo(prev => ({ ...prev, customerName: e.target.value }))}
                className="form-input"
                placeholder="Örn: Ercan İnşaat"
              />
            </div>

            <div className="form-group">
              <label>Proje Adı</label>
              <input 
                type="text"
                value={clientInfo.projectName}
                onChange={(e) => setClientInfo(prev => ({ ...prev, projectName: e.target.value }))}
                className="form-input"
                placeholder="Örn: BOLLUCA VİLLALARI"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teklif No</label>
                <input 
                  type="text"
                  value={clientInfo.proposalNo}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, proposalNo: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Teklif Tarihi</label>
                <input 
                  type="date"
                  value={clientInfo.date}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, date: e.target.value }))}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Geçerlilik</label>
                <input 
                  type="date"
                  value={clientInfo.validUntil}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Hazırlayan</label>
                <input 
                  type="text"
                  value={clientInfo.preparedBy}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, preparedBy: e.target.value }))}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Tax & Global Pricing configuration */}
          <div className="glass-panel">
            <h3 className="panel-title">
              <Calculator size={18} />
              KDV & Hesaplama
            </h3>
            
            <div className="form-row" style={{ alignItems: 'center' }}>
              <div className="form-group">
                <label>KDV Oranı (%)</label>
                <select 
                  value={kdvRate} 
                  onChange={(e) => setKdvRate(Number(e.target.value))}
                  className="form-select"
                >
                  <option value={0}>0% (KDV Muaf)</option>
                  <option value={10}>10% KDV</option>
                  <option value={20}>20% KDV</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>KDV Dahil Mi?</label>
                <div style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                  <label className="checkbox-container">
                    <input 
                      type="checkbox"
                      checked={kdvIncluded}
                      onChange={(e) => setKdvIncluded(e.target.checked)}
                    />
                    <div className="checkmark">
                      <Check />
                    </div>
                  </label>
                  <span style={{ fontSize: '0.85rem', marginLeft: '0.5rem', fontWeight: 500 }}>
                    KDV Dahil
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Boru Montaj Bedeli PPRC:</span>
                <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>%45 Otomatik</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Boru Montaj Bedeli PVC:</span>
                <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>%65 Otomatik</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Boru Montaj Bedeli Gaz:</span>
                <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>%45 Otomatik</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms list manager */}
          <div className="glass-panel">
            <h3 className="panel-title">
              <Info size={18} />
              Teklif Notları (Şartlar)
            </h3>
            
            <div className="notes-list">
              {notes.map((note, idx) => (
                <div key={idx} className="note-item">
                  <span>{note}</span>
                  <button 
                    onClick={() => handleDeleteNote(idx)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '2px' }}
                    title="Sil"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="note-item-input-container">
              <input 
                type="text" 
                value={newNote} 
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Yeni not/koşul girin..."
                className="form-input"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button onClick={handleAddNote} className="btn btn-primary btn-icon-only">
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Templates list manager */}
          <div className="glass-panel">
            <h3 className="panel-title">
              <FolderOpen size={18} />
              Kayıtlı Şablonlar
            </h3>

            <div className="proposal-templates-list">
              {savedTemplates.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                  Kayıtlı şablon bulunamadı.
                </p>
              ) : (
                savedTemplates.map(tpl => (
                  <div key={tpl.id} className="template-card">
                    <div className="template-card-info" onClick={() => handleLoadTemplate(tpl)} style={{ cursor: 'pointer', flex: 1 }}>
                      <h4>{tpl.name}</h4>
                      <p>{tpl.timestamp} - {tpl.clientInfo.projectName}</p>
                    </div>
                    <div className="template-card-actions">
                      <button 
                        onClick={() => handleDeleteTemplate(tpl.id, tpl.name)}
                        className="btn btn-danger btn-icon-only"
                        title="Şablonu Sil"
                        style={{ width: '26px', height: '26px' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <input 
                type="text"
                placeholder="Şablon Adı..."
                value={saveTemplateName}
                onChange={(e) => setSaveTemplateName(e.target.value)}
                className="form-input"
              />
              <button onClick={handleSaveTemplate} className="btn btn-secondary" style={{ width: '100%' }}>
                <Save size={16} />
                Çalışmayı Şablon Kaydet
              </button>
            </div>
          </div>
        </section>

        {/* Content Area: Tabs + Category Lists & Items */}
        <section className="content-area">
          {/* Proposal Type Selector */}
          <div className="proposal-type-container" style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', background: 'rgba(0, 0, 0, 0.1)', padding: '6px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setProposalType('detailed')} 
              className={`btn ${proposalType === 'detailed' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.95rem' }}
            >
              Detaylı Teklif (Malzeme Listeli)
            </button>
            <button 
              onClick={() => setProposalType('simple')} 
              className={`btn ${proposalType === 'simple' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.95rem' }}
            >
              Sade Teklif (Özet Metinli)
            </button>
          </div>

          {proposalType === 'detailed' ? (
            <>
              {/* Tab bar switch */}
              <div className="tab-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '0.35rem', alignItems: 'center' }}>
                {allTabs.map(tabName => (
                  <button 
                    key={tabName}
                    onClick={() => setActiveTab(tabName)}
                    className={`tab-btn ${activeTab === tabName ? 'active' : ''}`}
                    style={{ flex: 'none' }}
                  >
                    {tabName}
                  </button>
                ))}
                <button 
                  onClick={handleAddNewTab}
                  className="btn btn-secondary tab-btn"
                  style={{ 
                    padding: '0.5rem 0.75rem', 
                    fontSize: '0.85rem', 
                    flex: 'none', 
                    background: 'rgba(255,62,29,0.15)', 
                    borderColor: 'rgba(255,62,29,0.3)', 
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Yeni Teklif Sekmesi / Kategori Ekle"
                >
                  <Plus size={14} />
                  Yeni Sekme Ekle
                </button>
              </div>

              {/* Table filters */}
              <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                  <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                  <input 
                    type="text"
                    placeholder="Tabloda ürün veya marka ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '32px' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label className="checkbox-container">
                    <input 
                      type="checkbox"
                      checked={showOnlySelected}
                      onChange={(e) => setShowOnlySelected(e.target.checked)}
                    />
                    <div className="checkmark">
                      <Check />
                    </div>
                  </label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sadece Seçilenleri Göster</span>
                </div>

                {customTabs.includes(activeTab) && (
                  <button 
                    onClick={() => handleDeleteCustomTab(activeTab)}
                    className="btn btn-danger"
                    style={{ marginLeft: searchQuery ? 'auto' : '1rem' }}
                  >
                    <Trash2 size={16} />
                    Kategoriyi Sil
                  </button>
                )}

                <button 
                  onClick={handleResetForm}
                  className="btn btn-danger"
                  style={{ marginLeft: customTabs.includes(activeTab) ? '0.5rem' : 'auto' }}
                >
                  <RotateCcw size={16} />
                  Tüm Veriyi Sıfırla
                </button>
              </div>

              {/* Message for custom/empty categories */}
              {(!filteredProductsDb || filteredProductsDb.categories.length === 0) && activeTabCustomItems.length === 0 && (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
                    Bu kategoride henüz malzeme bulunmuyor. Aşağıdaki "Yeni Ürün / İşçilik Ekle" formunu kullanarak bu kategoriye malzeme ekleyebilirsiniz.
                  </p>
                </div>
              )}

              {/* Active sheet items database */}
              {filteredProductsDb && filteredProductsDb.categories.map(cat => (
                <div key={cat.name} className="category-section">
                  <div className="category-header">
                    <h3>{cat.name}</h3>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        onClick={() => handleToggleCategory(cat.name, true)}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        Hepsini Seç
                      </button>
                      <button 
                        onClick={() => handleToggleCategory(cat.name, false)}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        Temizle
                      </button>
                    </div>
                  </div>

                  <div className="items-table-container">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th className="col-check">Teklif</th>
                          <th className="col-name">Yapılacak İşin Cinsi / Malzeme</th>
                          <th className="col-sorumlu">Sorumlu</th>
                          <th className="col-marka">Marka</th>
                          <th className="col-qty">Miktar</th>
                          <th className="col-unit">Birim</th>
                          <th className="col-price">Birim Fiyat</th>
                          <th className="col-discount">İsk (%)</th>
                          <th className="col-total">Toplam</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.items.map(item => {
                          const isExcluded = !item.included;
                          return (
                            <tr 
                              key={item.id} 
                              className={`${isExcluded ? 'row-excluded' : ''} ${item.isAutoCalculated ? 'row-auto-calculated' : ''}`}
                            >
                              <td className="col-check">
                                <label className="checkbox-container">
                                  <input 
                                    type="checkbox"
                                    checked={item.included}
                                    onChange={(e) => handleItemPropChange(item.id, 'included', e.target.checked)}
                                  />
                                  <div className="checkmark">
                                    <Check />
                                  </div>
                                </label>
                              </td>
                              <td className="col-name">
                                <div style={{ fontWeight: 600 }}>{item.name}</div>
                                {item.description && (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'pre-line' }}>
                                    {item.description}
                                  </div>
                                )}
                              </td>
                              <td className="col-sorumlu">
                                <select 
                                  value={item.sorumlu}
                                  onChange={(e) => handleItemPropChange(item.id, 'sorumlu', e.target.value)}
                                  className="table-input"
                                  disabled={isExcluded}
                                >
                                  <option value="YÜKLENİCİ">Yüklenici</option>
                                  <option value="İŞVEREN">İşveren</option>
                                </select>
                              </td>
                              <td className="col-marka">
                                <input 
                                  type="text"
                                  value={item.marka}
                                  onChange={(e) => handleItemPropChange(item.id, 'marka', e.target.value)}
                                  className="table-input"
                                  placeholder="Serbest Giriş"
                                  disabled={isExcluded}
                                />
                              </td>
                              <td className="col-qty">
                                <input 
                                  type="number"
                                  value={item.qty}
                                  onChange={(e) => handleItemPropChange(item.id, 'qty', Math.max(0, Number(e.target.value)))}
                                  className="table-input"
                                  min="0"
                                  disabled={isExcluded}
                                />
                              </td>
                              <td className="col-unit">{item.unit}</td>
                              <td className="col-price">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                  <span>{currencySymbol}</span>
                                  <input 
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handleItemPropChange(item.id, 'price', Math.max(0, Number(e.target.value)))}
                                    className="table-input"
                                    min="0"
                                    step="0.01"
                                    disabled={isExcluded || item.isAutoCalculated}
                                    title={item.isAutoCalculated ? "Boru montaj bedeli sistem tarafından otomatik hesaplanır" : ""}
                                  />
                                </div>
                              </td>
                              <td className="col-discount">
                                <input 
                                  type="number"
                                  value={item.discount}
                                  onChange={(e) => handleItemPropChange(item.id, 'discount', Math.min(100, Math.max(0, Number(e.target.value))))}
                                  className="table-input"
                                  min="0"
                                  max="100"
                                  disabled={isExcluded || item.isAutoCalculated}
                                />
                              </td>
                              <td className="col-total">
                                {formatCurrency(item.itemTotal)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* Active Tab Custom Items */}
              {activeTabCustomItems.length > 0 && (
                <div className="category-section">
                  <div className="category-header">
                    <h3>Eklenen Özel Ürünler / İşçilikler</h3>
                  </div>

                  <div className="items-table-container">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th className="col-check">Teklif</th>
                          <th className="col-name">Ürün/İş Cinsi</th>
                          <th className="col-sorumlu">Sorumlu</th>
                          <th className="col-marka">Marka</th>
                          <th className="col-qty">Miktar</th>
                          <th className="col-unit">Birim</th>
                          <th className="col-price">Birim Fiyat</th>
                          <th className="col-discount">İsk (%)</th>
                          <th className="col-total">Toplam</th>
                          <th className="col-action">Sil</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeTabCustomItems.map(item => {
                          const isExcluded = !item.included;
                          return (
                            <tr key={item.id} className={isExcluded ? 'row-excluded' : ''}>
                              <td className="col-check">
                                <label className="checkbox-container">
                                  <input 
                                    type="checkbox"
                                    checked={item.included}
                                    onChange={(e) => handleItemPropChange(item.id, 'included', e.target.checked, true)}
                                  />
                                  <div className="checkmark">
                                    <Check />
                                  </div>
                                </label>
                              </td>
                              <td className="col-name">
                                <div style={{ fontWeight: 600 }}>{item.name}</div>
                              </td>
                              <td className="col-sorumlu">
                                <select 
                                  value={item.sorumlu}
                                  onChange={(e) => handleItemPropChange(item.id, 'sorumlu', e.target.value, true)}
                                  className="table-input"
                                  disabled={isExcluded}
                                >
                                  <option value="YÜKLENİCİ">Yüklenici</option>
                                  <option value="İŞVEREN">İşveren</option>
                                </select>
                              </td>
                              <td className="col-marka">
                                <input 
                                  type="text"
                                  value={item.marka}
                                  onChange={(e) => handleItemPropChange(item.id, 'marka', e.target.value, true)}
                                  className="table-input"
                                  disabled={isExcluded}
                                />
                              </td>
                              <td className="col-qty">
                                <input 
                                  type="number"
                                  value={item.qty}
                                  onChange={(e) => handleItemPropChange(item.id, 'qty', Math.max(0, Number(e.target.value)), true)}
                                  className="table-input"
                                  min="0"
                                  disabled={isExcluded}
                                />
                              </td>
                              <td className="col-unit">
                                <input 
                                  type="text"
                                  value={item.unit}
                                  onChange={(e) => handleItemPropChange(item.id, 'unit', e.target.value, true)}
                                  className="table-input"
                                  disabled={isExcluded}
                                />
                              </td>
                              <td className="col-price">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                  <span>{currencySymbol}</span>
                                  <input 
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handleItemPropChange(item.id, 'price', Math.max(0, Number(e.target.value)), true)}
                                    className="table-input"
                                    min="0"
                                    step="0.01"
                                    disabled={isExcluded}
                                  />
                                </div>
                              </td>
                              <td className="col-discount">
                                <input 
                                  type="number"
                                  value={item.discount}
                                  onChange={(e) => handleItemPropChange(item.id, 'discount', Math.min(100, Math.max(0, Number(e.target.value))), true)}
                                  className="table-input"
                                  min="0"
                                  max="100"
                                  disabled={isExcluded}
                                />
                              </td>
                              <td className="col-total">
                                {formatCurrency(item.itemTotal)}
                              </td>
                              <td className="col-action">
                                <button 
                                  onClick={() => handleDeleteCustomItem(item.id)}
                                  className="btn btn-danger btn-icon-only"
                                  title="Sil"
                                  style={{ width: '28px', height: '28px', padding: 0 }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Form to add a new custom item */}
              <div className="glass-panel" style={{ marginTop: '1.5rem' }}>
                <h3 className="panel-title" style={{ fontSize: '1rem', border: 'none', padding: 0, margin: 0 }}>
                  <PlusCircle size={16} />
                  Yeni Ürün / İşçilik Ekle
                </h3>
                
                <form onSubmit={handleAddCustomItem} className="add-custom-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', border: 'none', padding: 0 }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Malzeme / İşin Cinsi</label>
                    <input 
                      type="text"
                      value={customItemForm.name}
                      onChange={(e) => setCustomItemForm(prev => ({ ...prev, name: e.target.value }))}
                      className="form-input"
                      placeholder="Ürün veya işçilik adı..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Kategori</label>
                    <input 
                      type="text"
                      value={customItemForm.category}
                      onChange={(e) => setCustomItemForm(prev => ({ ...prev, category: e.target.value }))}
                      className="form-input"
                      placeholder="Grup adı"
                    />
                  </div>

                  <div className="form-group">
                    <label>Marka</label>
                    <input 
                      type="text"
                      value={customItemForm.marka}
                      onChange={(e) => setCustomItemForm(prev => ({ ...prev, marka: e.target.value }))}
                      className="form-input"
                      placeholder="E.g. Kalde"
                    />
                  </div>

                  <div className="form-group">
                    <label>Sorumlu</label>
                    <select 
                      value={customItemForm.sorumlu}
                      onChange={(e) => setCustomItemForm(prev => ({ ...prev, sorumlu: e.target.value }))}
                      className="form-select"
                    >
                      <option value="YÜKLENİCİ">Yüklenici</option>
                      <option value="İŞVEREN">İşveren</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Miktar</label>
                    <input 
                      type="number"
                      value={customItemForm.qty}
                      onChange={(e) => setCustomItemForm(prev => ({ ...prev, qty: Number(e.target.value) }))}
                      className="form-input"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Birim</label>
                    <input 
                      type="text"
                      value={customItemForm.unit}
                      onChange={(e) => setCustomItemForm(prev => ({ ...prev, unit: e.target.value }))}
                      className="form-input"
                      placeholder="Adet, Mt vb."
                    />
                  </div>

                  <div className="form-group">
                    <label>Birim Fiyat</label>
                    <input 
                      type="number"
                      value={customItemForm.price}
                      onChange={(e) => setCustomItemForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="form-input"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="form-group">
                    <label>İskonto (%)</label>
                    <input 
                      type="number"
                      value={customItemForm.discount}
                      onChange={(e) => setCustomItemForm(prev => ({ ...prev, discount: Number(e.target.value) }))}
                      className="form-input"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px' }}>
                      <Plus size={18} />
                      Listeye Ekle
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            // Simple Proposal Editor Form
            <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Sade Teklif Düzenleyici</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Teklif kapsamında yapılacak iş maddelerini, hitap ve fiyat detaylarını buradan girin.
                </p>
              </div>

              {/* Salutation and project details text */}
              <div className="form-row">
                <div className="form-group">
                  <label>Hitap Başlığı</label>
                  <input 
                    type="text"
                    value={simpleSalutation}
                    onChange={(e) => setSimpleSalutation(e.target.value)}
                    className="form-input"
                    placeholder="Örn: SAYIN YETKİLİ"
                  />
                </div>
                <div className="form-group">
                  <label>Proje Türü Tanımı</label>
                  <input 
                    type="text"
                    value={simpleProjectTypeText}
                    onChange={(e) => setSimpleProjectTypeText(e.target.value)}
                    className="form-input"
                    placeholder="Örn: VİLLA PROJENİZİN"
                  />
                </div>
              </div>

              {/* Work Scope Bullet Points Editor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Yapılacak İşlerin Kapsamı (Satırlar)
                </label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {simpleScopeItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '1.2rem' }}>•</span>
                      <input 
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...simpleScopeItems];
                          updated[idx] = e.target.value;
                          setSimpleScopeItems(updated);
                        }}
                        className="form-input"
                        style={{ flex: 1 }}
                      />
                      <button 
                        onClick={() => setSimpleScopeItems(simpleScopeItems.filter((_, i) => i !== idx))}
                        className="btn btn-danger btn-icon-only"
                        title="Satırı Sil"
                        style={{ width: '38px', height: '38px' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <input 
                    type="text"
                    placeholder="Yeni kapsam satırı ekleyin..."
                    value={newScopeItem}
                    onChange={(e) => setNewScopeItem(e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newScopeItem.trim()) {
                        setSimpleScopeItems([...simpleScopeItems, newScopeItem.trim()]);
                        setNewScopeItem("");
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      if (newScopeItem.trim()) {
                        setSimpleScopeItems([...simpleScopeItems, newScopeItem.trim()]);
                        setNewScopeItem("");
                      }
                    }}
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <Plus size={18} />
                    Ekle
                  </button>
                </div>
              </div>

              {/* Unit Pricing, Quantities and Details */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Birim Fiyatlandırma & Miktar Hesaplaması</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Birim Etiketi</label>
                    <input 
                      type="text"
                      value={simplePricing.unitLabel}
                      onChange={(e) => setSimplePricing({ ...simplePricing, unitLabel: e.target.value })}
                      className="form-input"
                      placeholder="Örn: 1 DAİRE FİYATI"
                    />
                  </div>
                  <div className="form-group">
                    <label>Birim Fiyat ({currencySymbol})</label>
                    <input 
                      type="number"
                      value={simplePricing.unitPrice}
                      onChange={(e) => setSimplePricing({ ...simplePricing, unitPrice: Number(e.target.value) })}
                      className="form-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Toplam Miktar / Adet</label>
                    <input 
                      type="number"
                      value={simplePricing.quantity}
                      onChange={(e) => setSimplePricing({ ...simplePricing, quantity: Number(e.target.value) })}
                      className="form-input"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Miktar Alt Detayları (Özet Kutu Satırları - Her Satır Yeni Bilgi)</label>
                  <textarea 
                    value={simplePricing.subDetails}
                    onChange={(e) => setSimplePricing({ ...simplePricing, subDetails: e.target.value })}
                    className="form-textarea"
                    rows={3}
                    placeholder="Örn:&#10;10 DÜKKAN (3 DAİRE)&#10;TOPLAM 13 DAİRE"
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div className="form-group">
                  <label>Ödeme Şekli ve Koşulları</label>
                  <input 
                    type="text"
                    value={simplePayment}
                    onChange={(e) => setSimplePayment(e.target.value)}
                    className="form-input"
                    placeholder="Örn: Karşılıklı Görüşülecektir."
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Sticky Bottom Summary Bar */}
      <footer className="summary-bar">
        <div className="summary-details">
          <div className="summary-stat">
            <span className="label">Brüt Tutar</span>
            <span className="val">{formatCurrency(financials.subtotalBeforeDiscount)}</span>
          </div>
          <div className="summary-stat">
            <span className="label">Toplam İskonto</span>
            <span className="val" style={{ color: 'var(--color-danger)' }}>
              -{formatCurrency(financials.totalDiscountAmount)}
            </span>
          </div>
          <div className="summary-stat">
            <span className="label">Ara Toplam (KDV Hariç)</span>
            <span className="val">{formatCurrency(financials.netSubtotal)}</span>
          </div>
          <div className="summary-stat">
            <span className="label">KDV ({kdvRate}%)</span>
            <span className="val">{formatCurrency(financials.kdvAmount)}</span>
          </div>
          <div className="summary-stat">
            <span className="label">{kdvIncluded ? "Net Toplam (KDV Dahil)" : "Genel Toplam"}</span>
            <span className="val grand-total">{formatCurrency(financials.grandTotal)}</span>
          </div>
        </div>

        <div className="summary-actions">
          <button 
            onClick={() => setShowPreview(true)}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
          >
            <Eye size={18} />
            Teklif Önizleme & PDF
          </button>
        </div>
      </footer>

      {/* PDF Cover and Proposal Preview Modal */}
      {showPreview && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Teklif Önizleme ve Yazdırma</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleDownloadPDF} 
                  className="btn btn-primary"
                  disabled={pdfGenerating}
                >
                  <Download size={18} />
                  {pdfGenerating ? "PDF Oluşturuluyor..." : "PDF Olarak İndir"}
                </button>
                <button onClick={() => setShowPreview(false)} className="btn btn-secondary">
                  Kapat
                </button>
              </div>
            </div>

            <div className="modal-body">
              {/* This template is what gets rendered to PDF page by page */}
              <div className="pdf-page-container" id="pdf-content">
                {proposalType === 'simple' ? (
                  /* SINGLE PAGE SIMPLE PROPOSAL TEMPLATE */
                  <div className="a4-page" id="page-simple-pdf" style={{ padding: '30px 40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', height: '1123px', position: 'relative', color: '#2d3748', background: '#ffffff', fontFamily: '"Outfit", sans-serif' }}>
                    {/* Header with Logo */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', borderBottom: '2px solid #ff3e1d', paddingBottom: '10px' }}>
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" style={{ maxHeight: '80px', width: 'auto', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Wrench size={35} strokeWidth={2.5} color="#ff3e1d" />
                          <div style={{ textAlign: 'left' }}>
                            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#1a202c', letterSpacing: '1px' }}>E MEKANİK</h1>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>Mekanik Tesisat Çözümleri</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata Header info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#4a5568', marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div><strong>TEKLİF SAHİBİ:</strong> E MEKANİK MÜHENDİSLİK LTD. ŞTİ.</div>
                        <div><strong>PROJE ADI:</strong> {clientInfo.projectName}</div>
                        <div><strong>TEKLİF NO:</strong> {clientInfo.proposalNo}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                        <div><strong>TARİH:</strong> {clientInfo.date}</div>
                        <div><strong>GEÇERLİLİK:</strong> {clientInfo.validUntil}</div>
                        <div><strong>MÜŞTERİ:</strong> {clientInfo.customerName}</div>
                      </div>
                    </div>

                    {/* Body Introduction */}
                    <div style={{ marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a202c', marginBottom: '6px' }}>{simpleSalutation},</h3>
                      <p style={{ fontSize: '0.8rem', lineHeight: '1.5', color: '#4a5568', margin: 0 }}>
                        {clientInfo.projectName} {simpleProjectTypeText} yapılması planlanan mekanik tesisat ana yapım işlerine ait işçilik ve malzeme kapsam listesi ve teklif bedeli detayları aşağıda bilgilerinize sunulmuştur:
                      </p>
                    </div>

                    {/* Scope Bullets */}
                    <div style={{ background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 15px', marginBottom: '15px', flex: 1, minHeight: '120px', display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        YAPILACAK İŞLERİN KAPSAMI
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: '#4a5568', lineHeight: '1.4' }}>
                        {simpleScopeItems.map((item, idx) => (
                          <li key={idx} style={{ listStyleType: 'disc' }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Simple Pricing & Summary Box */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '15px', background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '8px', padding: '10px 15px', marginBottom: '15px' }}>
                      {/* Left: Unit pricing details */}
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid #e2e8f0', paddingRight: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem' }}>
                          <span style={{ color: '#718096', fontWeight: 600 }}>BİRİM ETİKETİ:</span>
                          <span style={{ fontWeight: 700, color: '#2d3748' }}>{simplePricing.unitLabel}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem' }}>
                          <span style={{ color: '#718096', fontWeight: 600 }}>BİRİM FİYAT:</span>
                          <span style={{ fontWeight: 700, color: '#2d3748' }}>{formatCurrency(simplePricing.unitPrice)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem' }}>
                          <span style={{ color: '#718096', fontWeight: 600 }}>MİKTAR:</span>
                          <span style={{ fontWeight: 700, color: '#2d3748' }}>{simplePricing.quantity} ADET</span>
                        </div>
                        {simplePricing.subDetails && (
                          <div style={{ background: '#f7fafc', padding: '6px 10px', borderRadius: '4px', fontSize: '0.7rem', color: '#718096', whiteSpace: 'pre-line', marginTop: '4px', borderLeft: '3px solid #ff3e1d' }}>
                            {simplePricing.subDetails}
                          </div>
                        )}
                      </div>

                      {/* Right: Calculations matching standard financials */}
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                          <tbody>
                            <tr>
                              <td style={{ color: '#718096', padding: '3px 0', fontWeight: 600 }}>NET TUTAR:</td>
                              <td style={{ textAlign: 'right', fontWeight: 700, padding: '3px 0', color: '#2d3748' }}>
                                {formatCurrency(financials.subtotalBeforeDiscount)}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ color: '#718096', padding: '3px 0', fontWeight: 600 }}>KDV (%{kdvRate}):</td>
                              <td style={{ textAlign: 'right', fontWeight: 700, padding: '3px 0', color: '#2d3748' }}>
                                {formatCurrency(financials.kdvAmount)}
                              </td>
                            </tr>
                            <tr style={{ borderTop: '2px solid #e2e8f0' }}>
                              <td style={{ color: '#2d3748', padding: '4px 0 0 0', fontWeight: 800 }}>GENEL TOPLAM:</td>
                              <td style={{ textAlign: 'right', fontWeight: 800, padding: '4px 0 0 0', fontSize: '0.95rem', color: '#ff3e1d' }}>
                                {formatCurrency(financials.grandTotal)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Payment terms & Note */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', color: '#4a5568', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginBottom: '15px' }}>
                      <div><strong>ÖDEME PLANI:</strong> {simplePayment}</div>
                      <div><strong>KDV BİLGİSİ:</strong> Fiyatlarımıza KDV dâhil değildir. Tüm faturalandırılacak tutarlara yasal oran olan %{kdvRate} KDV ilave edilecektir.</div>
                    </div>

                    {/* Signatures */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: 'auto', borderTop: '1px solid #cbd5e0', paddingTop: '10px' }}>
                      <div style={{ textAlign: 'center', fontSize: '0.78rem' }}>
                        <p style={{ fontWeight: 700, color: '#2d3748', marginBottom: '20px' }}>Teklifi Sunan</p>
                        <div style={{ borderBottom: '1px dashed #cbd5e0', width: '70%', margin: '0 auto 6px' }}></div>
                        <p style={{ color: '#718096', fontSize: '0.68rem', margin: 0 }}>{clientInfo.preparedBy}</p>
                      </div>
                      <div style={{ textAlign: 'center', fontSize: '0.78rem' }}>
                        <p style={{ fontWeight: 700, color: '#2d3748', marginBottom: '20px' }}>Teklifi Onaylayan</p>
                        <div style={{ borderBottom: '1px dashed #cbd5e0', width: '70%', margin: '0 auto 6px' }}></div>
                        <p style={{ color: '#718096', fontSize: '0.68rem', margin: 0 }}>{clientInfo.customerName}</p>
                      </div>
                    </div>

                    {/* Footer branding */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#a0aec0', marginTop: '15px', borderTop: '1px solid #edf2f7', paddingTop: '6px' }}>
                      <span>E MEKANİK MÜHENDİSLİK - Mekanik Tesisat Çözüm Ortağınız</span>
                      <span>Teklif No: {clientInfo.proposalNo} | Sayfa 1 / 1</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* PAGE 1: COVER PAGE */}
                    <div className="a4-page" id="page-cover">
                      <div className="pdf-cover">
                        <div className="pdf-cover-header" style={{ borderBottom: logoUrl ? 'none' : '4px solid #ff3e1d', justifyContent: logoUrl ? 'center' : 'flex-start', paddingBottom: logoUrl ? '0px' : '20px' }}>
                          {logoUrl ? (
                            <img src={logoUrl} alt="Logo" style={{ maxHeight: '226px', width: 'auto', objectFit: 'contain' }} />
                          ) : (
                            <>
                              <Wrench size={45} strokeWidth={2.5} color="#ff3e1d" />
                              <div className="pdf-cover-logo-text">
                                <h1>E MEKANİK</h1>
                                <p>Mekanik Tesisat Çözümleri</p>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="pdf-cover-body">
                          <h2 className="pdf-cover-title">MEKANİK TESİSAT FİYAT TEKLİFİ</h2>
                          <h3 className="pdf-cover-subtitle">{clientInfo.projectName}</h3>
                          
                          <div className="pdf-cover-meta-grid">
                            <div className="pdf-cover-meta-label">TEKLİF NO:</div>
                            <div className="pdf-cover-meta-value">{clientInfo.proposalNo}</div>

                            <div className="pdf-cover-meta-label">MÜŞTERİ:</div>
                            <div className="pdf-cover-meta-value">{clientInfo.customerName}</div>

                            <div className="pdf-cover-meta-label">TARİH:</div>
                            <div className="pdf-cover-meta-value">{clientInfo.date}</div>

                            <div className="pdf-cover-meta-label">GEÇERLİLİK:</div>
                            <div className="pdf-cover-meta-value">{clientInfo.validUntil}</div>

                            <div className="pdf-cover-meta-label">HAZIRLAYAN:</div>
                            <div className="pdf-cover-meta-value">{clientInfo.preparedBy}</div>
                          </div>
                        </div>

                        <div className="pdf-cover-footer">
                          <p>E Mekanik Mühendislik ve Tesisat Hizmetleri</p>
                        </div>
                      </div>
                    </div>

                    {/* PAGES 2 to N: ITEMIZED QUANTITIES TABLES */}
                    {pdfPagesData.chunks.map((chunk, chunkIdx) => (
                      <div key={chunkIdx} className="a4-page" id={`page-table-${chunkIdx}`}>
                        <div className="pdf-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div className="pdf-header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {logoUrl && <img src={logoUrl} alt="Logo" style={{ height: '53px', objectFit: 'contain' }} />}
                            <h2 style={{ margin: 0, fontSize: '0.95rem' }}>{clientInfo.projectName} Mekanik Tesisat Teklifi</h2>
                          </div>
                          <div className="pdf-header-right">
                            <p>Teklif No: {clientInfo.proposalNo} | Sayfa {chunkIdx + 2} / {pdfPagesData.totalPages}</p>
                          </div>
                        </div>

                        <div className="pdf-body">
                          <h3 className="pdf-table-title">Mekanik Tesisat Malzeme Detay Listesi (Devamı)</h3>
                          
                          <table className="pdf-table">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th style={{ textAlign: 'left' }}>İşin Cinsi / Malzeme</th>
                                <th>Kategori</th>
                                <th>Birim</th>
                                <th>Miktar</th>
                                <th>Marka</th>
                                <th>Sorumlu</th>
                                <th>B. Fiyat ({currencySymbol})</th>
                                <th>İsk (%)</th>
                                <th style={{ textAlign: 'right' }}>Tutar ({currencySymbol})</th>
                              </tr>
                            </thead>
                            <tbody>
                              {chunk.map((item, idx) => (
                                <tr key={item.id}>
                                  <td style={{ textAlign: 'center', width: '25px' }}>
                                    {getChunkStartIndex(chunkIdx) + idx + 1}
                                  </td>
                                  <td style={{ fontWeight: 600, width: '220px' }}>
                                    {item.name}
                                  </td>
                                  <td style={{ color: '#4a5568', width: '90px' }}>
                                    {item.sheetName} - {item.categoryName}
                                  </td>
                                  <td style={{ textAlign: 'center', width: '45px' }}>{item.unit}</td>
                                  <td style={{ textAlign: 'center', width: '45px' }}>{item.qty}</td>
                                  <td style={{ textAlign: 'center', width: '80px' }}>{item.marka || "-"}</td>
                                  <td style={{ textAlign: 'center', fontSize: '0.6rem', width: '70px', fontWeight: 600 }}>
                                    {item.sorumlu}
                                  </td>
                                  <td style={{ textAlign: 'center', width: '75px' }}>
                                    {item.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                  </td>
                                  <td style={{ textAlign: 'center', width: '40px' }}>{item.discount}</td>
                                  <td className="col-total" style={{ width: '85px' }}>
                                    {item.itemTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* If summary page is NOT separate, and this is the last chunk, render calculations + notes + signatures on this page */}
                          {!pdfPagesData.hasSeparateSummaryPage && chunkIdx === pdfPagesData.chunks.length - 1 && (
                            <div style={{ marginTop: 'auto' }}>
                              <div className="pdf-summary-block">
                                {/* Notes */}
                                <div className="pdf-notes-section">
                                  <h3>Teklif Koşulları</h3>
                                  {notes.map((note, idx) => (
                                    <div key={idx} className="pdf-note-item">
                                      {note}
                                    </div>
                                  ))}
                                </div>

                                {/* Totals */}
                                <div>
                                  <table className="pdf-totals-table">
                                    <tbody>
                                      <tr>
                                        <td className="label">Toplam Tutar:</td>
                                        <td className="val">{formatCurrency(financials.subtotalBeforeDiscount)}</td>
                                      </tr>
                                      <tr>
                                        <td className="label">İskonto Tutarı:</td>
                                        <td className="val">-{formatCurrency(financials.totalDiscountAmount)}</td>
                                      </tr>
                                      <tr>
                                        <td className="label">Ara Toplam:</td>
                                        <td className="val">{formatCurrency(financials.netSubtotal)}</td>
                                      </tr>
                                      <tr>
                                        <td className="label">KDV ({kdvRate}%):</td>
                                        <td className="val">{formatCurrency(financials.kdvAmount)}</td>
                                      </tr>
                                      <tr className="grand-total-row">
                                        <td className="label">{kdvIncluded ? "Toplam (KDV Dahil):" : "Genel Toplam:"}</td>
                                        <td className="val">{formatCurrency(financials.grandTotal)}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Signatures */}
                              <div className="pdf-signatures">
                                <div className="pdf-signature-box">
                                  <p className="pdf-signature-title">Teklifi Hazırlayan</p>
                                  <div className="pdf-signature-line"></div>
                                  <p className="pdf-signature-subtitle">{clientInfo.preparedBy}</p>
                                </div>
                                <div className="pdf-signature-box">
                                  <p className="pdf-signature-title">Müşteri Onay</p>
                                  <div className="pdf-signature-line"></div>
                                  <p className="pdf-signature-subtitle">{clientInfo.customerName}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pdf-footer">
                          <p>E MEKANİK Mühendislik Hizmetleri</p>
                          <p>Tarih: {clientInfo.date} | Teklif No: {clientInfo.proposalNo}</p>
                        </div>
                      </div>
                    ))}

                    {/* PAGE LAST: SUMMARY PAGE (Only if separate page is required due to chunk overflow) */}
                    {pdfPagesData.hasSeparateSummaryPage && (
                      <div className="a4-page" id="page-summary">
                        <div className="pdf-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div className="pdf-header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {logoUrl && <img src={logoUrl} alt="Logo" style={{ height: '53px', objectFit: 'contain' }} />}
                            <h2 style={{ margin: 0, fontSize: '0.95rem' }}>{clientInfo.projectName} Mekanik Tesisat Teklifi</h2>
                          </div>
                          <div className="pdf-header-right">
                            <p>Teklif No: {clientInfo.proposalNo} | Sayfa {pdfPagesData.totalPages} / {pdfPagesData.totalPages}</p>
                          </div>
                        </div>

                        <div className="pdf-body" style={{ justifyContent: 'space-between' }}>
                          <div>
                            <h3 className="pdf-table-title" style={{ borderBottom: '2px solid #cbd5e0', paddingBottom: '5px', marginBottom: '15px' }}>
                              Teklif Özeti ve Genel Toplamlar
                            </h3>

                            <div className="pdf-summary-block" style={{ gridTemplateColumns: '1.2fr 1fr', marginTop: '20px' }}>
                              {/* Notes */}
                              <div className="pdf-notes-section">
                                <h3>Teklif Şartnamesi & Koşullar</h3>
                                {notes.map((note, idx) => (
                                  <div key={idx} className="pdf-note-item" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>
                                    {note}
                                  </div>
                                ))}
                              </div>

                              {/* Totals */}
                              <div>
                                <table className="pdf-totals-table" style={{ fontSize: '0.8rem' }}>
                                  <tbody>
                                    <tr>
                                      <td className="label" style={{ padding: '8px' }}>Malzeme/İşçilik Brüt Toplamı:</td>
                                      <td className="val" style={{ padding: '8px' }}>{formatCurrency(financials.subtotalBeforeDiscount)}</td>
                                    </tr>
                                    <tr>
                                      <td className="label" style={{ padding: '8px' }}>Düşülen İskonto Toplamı:</td>
                                      <td className="val" style={{ padding: '8px', color: '#e53e3e' }}>-{formatCurrency(financials.totalDiscountAmount)}</td>
                                    </tr>
                                    <tr>
                                      <td className="label" style={{ padding: '8px' }}>Ara Toplam (KDV Matrahı):</td>
                                      <td className="val" style={{ padding: '8px' }}>{formatCurrency(financials.netSubtotal)}</td>
                                    </tr>
                                    <tr>
                                      <td className="label" style={{ padding: '8px' }}>Hesaplanan KDV (%{kdvRate}):</td>
                                      <td className="val" style={{ padding: '8px' }}>{formatCurrency(financials.kdvAmount)}</td>
                                    </tr>
                                    <tr className="grand-total-row" style={{ fontSize: '0.95rem' }}>
                                      <td className="label" style={{ padding: '10px' }}>{kdvIncluded ? "Net Toplam (KDV Dahil):" : "Ödenecek Genel Toplam:"}</td>
                                      <td className="val" style={{ padding: '10px', color: '#ff3e1d', fontWeight: 800 }}>{formatCurrency(financials.grandTotal)}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          {/* Signatures */}
                          <div className="pdf-signatures" style={{ marginTop: 'auto', marginBottom: '40px' }}>
                            <div className="pdf-signature-box">
                              <p className="pdf-signature-title" style={{ fontSize: '0.85rem' }}>Teklifi Sunan</p>
                              <div className="pdf-signature-line" style={{ width: '60%' }}></div>
                              <p className="pdf-signature-subtitle" style={{ fontSize: '0.75rem' }}>{clientInfo.preparedBy}</p>
                              <p style={{ fontSize: '0.6rem', color: '#a0aec0', marginTop: '5px' }}>Kaşe / İmza</p>
                            </div>
                            <div className="pdf-signature-box">
                              <p className="pdf-signature-title" style={{ fontSize: '0.85rem' }}>Teklifi Onaylayan</p>
                              <div className="pdf-signature-line" style={{ width: '60%' }}></div>
                              <p className="pdf-signature-subtitle" style={{ fontSize: '0.75rem' }}>{clientInfo.customerName}</p>
                              <p style={{ fontSize: '0.6rem', color: '#a0aec0', marginTop: '5px' }}>Onay Tarihi / İmza</p>
                            </div>
                          </div>
                        </div>

                        <div className="pdf-footer">
                          <p>E MEKANİK Mühendislik Hizmetleri</p>
                          <p>Tarih: {clientInfo.date} | Teklif No: {clientInfo.proposalNo}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
