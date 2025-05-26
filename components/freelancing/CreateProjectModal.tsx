"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Upload, Sparkles, Euro, Mic, ClipboardPaste, FileUp, FileAudio, Send, Clock, Target, DollarSign, ClipboardList, ListChecks, Briefcase, Landmark, FileText, CheckSquare } from "lucide-react"
import Image from "next/image"

interface Task {
  id: string
  name: string
  price: number
  hours: number
}

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    description: "",
  })
  const [totalBudget, setTotalBudget] = useState<number>(300) // Sempre intero
  const [budgetInputValue, setBudgetInputValue] = useState<string>(Math.round(totalBudget).toString())

  const defaultTasks: Task[] = [
    { id: "1", name: "Pianificazione iniziale", price: 150, hours: 5 },
    { id: "2", name: "Sviluppo principale", price: 150, hours: 10 },
  ].map(task => ({ ...task, price: Math.round(task.price) }));

  const [tasks, setTasks] = useState<Task[]>(defaultTasks)
  const [newTask, setNewTask] = useState({ name: "", price: "", hours: "" }) // price e hours sono stringhe per input

  // Stati per la sezione AI
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>("");
  const [isDraggingPdf, setIsDraggingPdf] = useState<boolean>(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const hasManualInput = formData.title.trim() !== "" && totalBudget > 0;
  const hasAiInput = pdfFile !== null || audioFile !== null || pastedText.trim() !== "";
  const isButtonDisabled = !(hasManualInput || hasAiInput);

  // Stati per disabilitazione reciproca input AI
  const [isPdfInputDisabled, setIsPdfInputDisabled] = useState(false);
  const [isAudioInputDisabled, setIsAudioInputDisabled] = useState(false);
  const [isTextInputDisabled, setIsTextInputDisabled] = useState(false);

  useEffect(() => {
    setIsPdfInputDisabled(audioFile !== null || pastedText.trim() !== "");
    setIsAudioInputDisabled(pdfFile !== null || pastedText.trim() !== "");
    setIsTextInputDisabled(pdfFile !== null || audioFile !== null);
  }, [pdfFile, audioFile, pastedText]);

  const [prevButtonDisabled, setPrevButtonDisabled] = useState(isButtonDisabled);
  const [shouldAnimateButton, setShouldAnimateButton] = useState(false);

  useEffect(() => {
    if (prevButtonDisabled && !isButtonDisabled) {
      setShouldAnimateButton(true);
      const timer = setTimeout(() => setShouldAnimateButton(false), 800);
      return () => clearTimeout(timer);
    }
    setPrevButtonDisabled(isButtonDisabled);
  }, [isButtonDisabled, prevButtonDisabled]);

  const formatToCapitalized = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.substring(1);
  };

  const redistributeTasks = (newBudget: number, currentTasks: Task[]): Task[] => {
    const roundedBudget = Math.round(newBudget);
    if (currentTasks.length === 0) return [];

    const basePrice = Math.floor(roundedBudget / currentTasks.length);
    let remainder = roundedBudget % currentTasks.length;

    const distributedTasks = currentTasks.map((task) => {
      let price = basePrice;
      if (remainder > 0) {
        price += 1;
        remainder--;
      }
      return { ...task, price: Math.round(price) }; // Assicura intero
    });

    // Correzione finale per assicurare che la somma sia esatta
    const sumOfTasks = distributedTasks.reduce((acc, curr) => acc + curr.price, 0);
    if (sumOfTasks !== roundedBudget && distributedTasks.length > 0) {
      const difference = roundedBudget - sumOfTasks;
      distributedTasks[distributedTasks.length - 1].price += difference;
      distributedTasks[distributedTasks.length - 1].price = Math.round(distributedTasks[distributedTasks.length - 1].price);
    }
    return distributedTasks;
  }

  useEffect(() => {
    if (isOpen) {
      const roundedInitialBudget = Math.round(totalBudget);
      setTotalBudget(roundedInitialBudget); // Assicura che totalBudget sia intero all'apertura
      setBudgetInputValue(roundedInitialBudget.toString());
      // Clona defaultTasks per evitare mutazioni se sono usati altrove o per resettare
      const initialTasks = defaultTasks.map(t => ({ ...t }));
      const redistributed = redistributeTasks(roundedInitialBudget, initialTasks);
      setTasks(redistributed);
    }
  }, [isOpen]); // Rimosso totalBudget dalle dipendenze per evitare loop se defaultTasks cambiano

  const updateTotalFromTasks = (updatedTasks: Task[]) => {
    const total = updatedTasks.reduce((sum, task) => sum + Math.round(task.price), 0);
    const roundedTotal = Math.round(total);
    setTotalBudget(roundedTotal);
    setBudgetInputValue(roundedTotal.toString());
  }

  const addTask = () => {
    if (newTask.name) {
      const newTaskPrice = newTask.price ? Math.round(Number.parseFloat(newTask.price)) : 0;
      const newTaskHours = newTask.hours ? Math.round(Number.parseFloat(newTask.hours)) : 0;
      const newTaskObj: Task = {
        id: Date.now().toString(),
        name: newTask.name,
        price: newTaskPrice,
        hours: newTaskHours,
      };

      let currentTotalBudget = Math.round(totalBudget);
      let updatedTasksList = [newTaskObj, ...tasks];

      if (newTaskPrice === 0 && currentTotalBudget > 0) { // Se il nuovo task non ha prezzo e c'è un budget, redistribuisci
        updatedTasksList = redistributeTasks(currentTotalBudget, updatedTasksList);
      } else { // Altrimenti, il nuovo task ha un prezzo, quindi aggiorna il budget totale dalla somma dei task
        const newTotalFromTasks = updatedTasksList.reduce((sum, task) => sum + task.price, 0);
        currentTotalBudget = Math.round(newTotalFromTasks);
        // Non è necessario redistribuire se il task ha un prezzo, basta aggiornare il totale.
      }

      setTasks(updatedTasksList);
      setTotalBudget(currentTotalBudget); // Aggiorna totalBudget
      setBudgetInputValue(currentTotalBudget.toString()); // E il suo input field
      updateTotalFromTasks(updatedTasksList); // Chiamata finale per coerenza
      setNewTask({ name: "", price: "", hours: "" });
    }
  }

  const removeTask = (taskId: string) => {
    let remainingTasks = tasks.filter((task) => task.id !== taskId);
    if (remainingTasks.length > 0) {
      const currentBudget = Math.round(totalBudget); // Usa il budget attuale per la ridistribuzione
      remainingTasks = redistributeTasks(currentBudget, remainingTasks);
      setTasks(remainingTasks);
      updateTotalFromTasks(remainingTasks); // Aggiorna il budget in base alla somma dei task rimanenti
    } else {
      setTasks([]);
      setTotalBudget(0); // Se non ci sono task, azzera il budget
      setBudgetInputValue("0");
    }
  }

  const updateTaskPrice = (taskId: string, newPriceString: string) => {
    const newPrice = Math.round(Number.parseFloat(newPriceString) || 0);
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, price: newPrice } : task
    );
    setTasks(updatedTasks);
    updateTotalFromTasks(updatedTasks);
  }

  const handleBudgetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStringValue = e.target.value;
    setBudgetInputValue(newStringValue);

    if (newStringValue === "") {
      setTotalBudget(0);
      if (tasks.length > 0) {
        const redistributed = redistributeTasks(0, tasks);
        setTasks(redistributed);
      }
    } else {
      const newNumericValue = Number.parseFloat(newStringValue);
      if (!isNaN(newNumericValue) && newNumericValue >= 0) {
        // Non arrotondare totalBudget qui, fallo onBlur per permettere la digitazione dei decimali
        // Ma per la ridistribuzione, usa un valore arrotondato
        const tempRoundedBudget = Math.round(newNumericValue);
        setTotalBudget(tempRoundedBudget); // Aggiorna subito il totalBudget con il valore arrotondato
        if (tasks.length > 0) {
          const redistributed = redistributeTasks(tempRoundedBudget, tasks);
          setTasks(redistributed);
        }
      } else if (isNaN(newNumericValue)) {
        // Se non è un numero valido (e non vuoto/solo meno), non fare nulla o resetta
        // Per ora non aggiorniamo totalBudget, l'utente vede l'input invalido
      }
    }
  };

  const handleBudgetInputBlur = () => {
    let finalNumericBudget: number;
    if (budgetInputValue === "" || budgetInputValue === "-") {
      finalNumericBudget = 0;
    } else {
      finalNumericBudget = Number.parseFloat(budgetInputValue);
      if (isNaN(finalNumericBudget) || finalNumericBudget < 0) {
        finalNumericBudget = 0; // Default a 0 se invalido
      }
    }

    const roundedBudget = Math.round(finalNumericBudget);
    setTotalBudget(roundedBudget);
    setBudgetInputValue(roundedBudget.toString());
    if (tasks.length > 0) {
      const redistributed = redistributeTasks(roundedBudget, tasks);
      setTasks(redistributed);
      // Assicurati che totalBudget sia la somma esatta dei task dopo la ridistribuzione finale
      const sumOfRedistributed = redistributed.reduce((acc, task) => acc + task.price, 0);
      if (sumOfRedistributed !== roundedBudget) {
        setTotalBudget(sumOfRedistributed);
        setBudgetInputValue(sumOfRedistributed.toString());
      }
    }
  };

  // Funzione per aggiornare le ore di un task esistente
  const updateTaskHours = (taskId: string, newHoursString: string) => {
    const newHours = Math.max(0, Math.round(Number.parseFloat(newHoursString) || 0)); // Assicura >= 0 e intero
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, hours: newHours } : task
      )
    );
    // Nota: l'aggiornamento delle ore non influisce sulla ridistribuzione del budget totale.
  }

  const handleSubmit = () => {
    if (hasAiInput) {
      // Se c'è un input AI, la priorità è processare quello.
      // handleAISubmit dovrebbe idealmente gestire la successiva popolazione del form
      // e/o il submit finale con i dati dell'AI.
      if (pdfFile) {
        handleAISubmit('pdf');
      } else if (audioFile) {
        handleAISubmit('audio');
      } else if (pastedText.trim() !== "") {
        handleAISubmit('text');
      }
      // Dopo aver avviato il processo AI, potremmo voler resettare gli input AI
      // o attendere che l'AI popoli il form prima di un ulteriore submit.
      // Per ora, l'azione si ferma qui per il flusso AI, 
      // assumendo che handleAISubmit gestirà il resto.
      // Reset degli input AI per permettere un nuovo tentativo o un input manuale.
      setPdfFile(null);
      setAudioFile(null);
      setPastedText("");
      // Potrebbe essere utile chiudere il modale o dare un feedback visivo che l'AI sta lavorando.
      // onClose(); // Esempio: chiudere il modale
      return; // Termina qui per il flusso AI
    }

    // Se non c'è input AI, procedi con il submit del form manuale
    // Assicura che il budget e i prezzi dei task siano interi prima del submit
    const finalBudget = Math.round(totalBudget);
    const finalTasks = tasks.map(task => ({
      ...task,
      price: Math.round(task.price),
      hours: Math.round(task.hours)
    }));

    // Verifica coerenza finale: la somma dei task deve eguagliare il budget finale
    let sumOfFinalTasks = finalTasks.reduce((sum, task) => sum + task.price, 0);
    let budgetToSubmit = finalBudget;

    if (sumOfFinalTasks !== finalBudget && finalTasks.length > 0) {
      budgetToSubmit = sumOfFinalTasks;
    } else if (finalTasks.length === 0) {
      budgetToSubmit = 0; // Se non ci sono task, il budget è 0
    }


    onSubmit({
      ...formData,
      budget: budgetToSubmit,
      tasks: finalTasks,
    });

    // Reset form
    const defaultResetBudget = 300;
    setFormData({ title: "", client: "", description: "" });
    setTotalBudget(defaultResetBudget);
    setBudgetInputValue(defaultResetBudget.toString());
    const resetTasksArray = defaultTasks.map(t => ({ ...t })); // Crea una nuova copia per il reset
    setTasks(redistributeTasks(defaultResetBudget, resetTasksArray));
    setNewTask({ name: "", price: "", hours: "" });
  }

  // Handler per upload PDF
  const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    }
  };
  const handlePdfDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingPdf(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      if (event.dataTransfer.files[0].type === "application/pdf") {
        setPdfFile(event.dataTransfer.files[0]);
      } else {
        // Potresti mostrare un errore qui se il file non è PDF
        console.warn("File non PDF scartato");
      }
    }
  };
  const handlePdfDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingPdf(true);
  };
  const handlePdfDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingPdf(false);
  };

  // Handler per upload Audio
  const handleAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAudioFile(event.target.files[0]);
    }
  };

  // Handler per invio AI (placeholder) ---------------
  const handleAISubmit = async (type: 'pdf' | 'audio' | 'text') => {
    console.log(`AI Submit: ${type}`, { pdfFile, audioFile, pastedText });
    // Mostra un feedback di caricamento/elaborazione all'utente
    // const showLoadingToast = () => { /* ... implementa toast di caricamento ... */ };
    // showLoadingToast();

    try {
      // 1. Qui invieresti i dati al tuo backend FastAPI
      // const formDataForApi = new FormData();
      // if (type === 'pdf' && pdfFile) formDataForApi.append('file', pdfFile);
      // if (type === 'audio' && audioFile) formDataForApi.append('file', audioFile);
      // if (type === 'text') formDataForApi.append('text', pastedText);
      // ...aggiungi altri parametri se necessario...

      // const response = await fetch('/api/ai-process', { // Immagina un endpoint API
      //   method: 'POST',
      //   body: formDataForApi,
      // });
      // const aiData = await response.json();

      // if (!response.ok) {
      //   throw new Error(aiData.message || 'Errore durante l'elaborazione AI');
      // }

      // ***** SIMULAZIONE RISPOSTA AI *****
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula attesa network
      const mockAIData = {
        title: type === 'pdf' ? "Progetto da PDF" : type === 'audio' ? "Progetto da Audio" : "Progetto da Testo",
        client: "Cliente Generato AI",
        description: "Questa è una descrizione generata automaticamente dall\'AI.",
        budget: 550,
        tasks: [
          { id: "ai-task-1", name: "Task AI 1 - Analisi", price: 200, hours: 8 },
          { id: "ai-task-2", name: "Task AI 2 - Sviluppo Iniziale", price: 350, hours: 15 },
        ]
      };
      // ***** FINE SIMULAZIONE *****

      // 2. Popola il form con i dati ricevuti dall'AI
      setFormData({
        title: mockAIData.title,
        client: mockAIData.client,
        description: mockAIData.description,
      });
      const roundedBudget = Math.round(mockAIData.budget);
      setTotalBudget(roundedBudget);
      setBudgetInputValue(roundedBudget.toString());
      setTasks(mockAIData.tasks.map(t => ({ ...t, price: Math.round(t.price), hours: Math.round(t.hours || 0) })));

      // 3. Opzionale: resetta gli input AI dopo l'elaborazione
      // setPdfFile(null);
      // setAudioFile(null);
      // setPastedText(""); 
      // --> Li resettiamo già in handleSubmit dopo la chiamata a handleAISubmit

      // Feedback positivo all'utente
      // const showSuccessToast = () => { /* ... implementa toast di successo ... */ };
      // showSuccessToast();

      // A questo punto, l'utente vede il form popolato.
      // Potrebbe voler fare modifiche o cliccare "Crea Progetto" per salvare.
      // Se vuoi che il progetto sia creato automaticamente dopo l'elaborazione AI:
      // onSubmit({ 
      //   title: mockAIData.title, 
      //   client: mockAIData.client, 
      //   description: mockAIData.description, 
      //   budget: roundedBudget, 
      //   tasks: mockAIData.tasks.map(t => ({...t, price: Math.round(t.price)}))
      // });
      // onClose(); // e chiudi il modale

    } catch (error) {
      console.error("Errore nell'elaborazione AI:", error);
      // Mostra un errore all'utente
      // const showErrorToast = (message) => { /* ... implementa toast di errore ... */ };
      // showErrorToast(error.message);
    }
  };
  // ----------------------------------------------------
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) { // Quando il modal si chiude
        onClose();
        // Reset allo stato iniziale quando si chiude, se necessario
        const defaultResetBudget = 300;
        setFormData({ title: "", client: "", description: "" });
        setTotalBudget(defaultResetBudget);
        setBudgetInputValue(defaultResetBudget.toString());
        const resetTasksArray = defaultTasks.map(t => ({ ...t }));
        setTasks(redistributeTasks(defaultResetBudget, resetTasksArray));
        setNewTask({ name: "", price: "", hours: "" });
      } else {
        // Logica di apertura già gestita da useEffect [isOpen]
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 bg-gray-50">
        <DialogHeader className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm p-4 sm:p-6 border-b flex flex-row justify-between items-center">
          <DialogTitle className="flex items-center space-x-2">
            <Image
              src="/online-analytical.png"
              alt="Nuovo Progetto Icona"
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="text-lg font-semibold text-gray-800">{formData.title ? `${formData.title}` : "Nuovo Progetto"}</span>
          </DialogTitle>
          <div className="flex space-x-2 sm:space-x-3 items-center">
            {/* Pulsante Annulla completo per schermi sm e superiori */}
            <Button variant="outline" onClick={onClose} size="lg" className="hidden sm:flex">
              Annulla
            </Button>
            {/* Icona X per schermi piccoli */}
            <Button variant="ghost" onClick={onClose} size="icon" className="flex sm:hidden text-red-500 hover:bg-red-100 p-2 rounded-full">
              <X className="w-5 h-5" />
            </Button>

            <motion.div
              animate={shouldAnimateButton ? {
                scale: [1, 1.08, 0.95, 1.05, 0.98, 1],
                rotate: [0, -2, 2, -2, 2, 0]
              } : {
                scale: 1,
                rotate: 0
              }}
              transition={shouldAnimateButton ? {
                duration: 0.8,
                ease: "easeInOut",
              } : {
                duration: 0.1
              }}
            >
              <Button
                onClick={handleSubmit}
                disabled={isButtonDisabled}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                size="lg"
              >
                Crea Progetto
              </Button>
            </motion.div>
          </div>
        </DialogHeader>

        <div className="space-y-6 flex-grow overflow-y-auto p-6">
          {/* AI Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border-2 border-dashed border-purple-200"
          >
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md font-medium text-sm">AI Project Creation</span>
            </div>
            <p className="text-sm text-purple-600 mb-3 text-center">
              Carica un PDF, un audio, o incolla del testo per iniziare. L'AI compilerà il form automaticamente.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {/* Opzione PDF */}
              <div
                className={`flex flex-col items-center justify-center h-32 sm:h-36 p-3 rounded-lg border-2 border-dashed transition-all 
                            ${isPdfInputDisabled ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed' :
                    isDraggingPdf ? 'border-purple-500 bg-purple-100/80 cursor-copy' : 'border-purple-300 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-400 cursor-pointer'}`}
                onClick={() => !isPdfInputDisabled && pdfInputRef.current?.click()}
                onDrop={!isPdfInputDisabled ? handlePdfDrop : undefined}
                onDragOver={!isPdfInputDisabled ? handlePdfDragOver : undefined}
                onDragLeave={!isPdfInputDisabled ? handlePdfDragLeave : undefined}
              >
                <input type="file" ref={pdfInputRef} onChange={handlePdfFileChange} accept=".pdf" className="hidden" disabled={isPdfInputDisabled} />
                <FileUp className={`w-7 h-7 sm:w-8 sm:h-8 mb-2 ${pdfFile ? 'text-green-500' : isPdfInputDisabled ? 'text-gray-400' : 'text-purple-600'}`} />
                <span className={`text-xs text-center ${isPdfInputDisabled ? 'text-gray-500' : 'text-purple-700'} w-full truncate px-1`} title={pdfFile ? pdfFile.name : 'Trascina PDF o Clicca'}>
                  {pdfFile ? (pdfFile.name.length > 20 ? "PDF Caricato" : pdfFile.name) : 'Trascina PDF o Clicca'}
                </span>
                {pdfFile && !isPdfInputDisabled && (
                  // Rimosso il pulsante Analizza, resta solo Rimuovi
                  <Button size="sm" variant="link" className="text-purple-500 h-auto p-0 mt-1 text-xs" onClick={(e) => { e.stopPropagation(); setPdfFile(null); if (pdfInputRef.current) pdfInputRef.current.value = ''; }}>
                    Rimuovi
                  </Button>
                )}
              </div>

              {/* Opzione Audio */}
              <div className={`flex flex-col items-center justify-start h-32 sm:h-36 p-3 rounded-lg border-2 border-dashed transition-all space-y-2 
                            ${isAudioInputDisabled ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed' : 'border-purple-300 bg-purple-50/50'}`}>
                <Button
                  variant="outline"
                  size="icon"
                  className={`text-purple-600 border-purple-300 hover:bg-purple-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 mt-1 ${isAudioInputDisabled ? '!cursor-not-allowed !bg-gray-200 !text-gray-400 !border-gray-300' : ''}`}
                  onClick={() => !isAudioInputDisabled && console.log('Registra audio clicked')}
                  disabled={isAudioInputDisabled}
                >
                  <Mic className={`w-6 h-6 sm:w-7 sm:h-7 ${audioFile ? 'text-gray-400' : isAudioInputDisabled ? 'text-gray-400' : 'text-purple-600'}`} />
                </Button>
                <span className={`text-xs pt-0 ${isAudioInputDisabled ? 'text-gray-500' : 'text-purple-700'}`}>Registra</span>

                <div className="w-full pt-1">
                  <Button variant="outline" size="sm" className={`w-full ${isAudioInputDisabled ? '!cursor-not-allowed !bg-gray-200 !text-gray-400 !border-gray-300' : 'text-purple-600 border-purple-300 hover:bg-purple-100'}`}
                    onClick={() => !isAudioInputDisabled && audioInputRef.current?.click()}
                    disabled={isAudioInputDisabled}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" /> Carica File Audio
                  </Button>
                  <input type="file" ref={audioInputRef} onChange={handleAudioFileChange} accept="audio/*" className="hidden" disabled={isAudioInputDisabled} />
                </div>

                {audioFile && !isAudioInputDisabled && (
                  <div className="flex flex-col items-center w-full">
                    {/* Rimosso il pulsante Analizza */}
                    <span className="text-xs text-center text-green-600 truncate w-full px-1" title={audioFile.name}>
                      {audioFile.name.length > 18 ? "Audio Caricato" : audioFile.name}
                    </span>
                    <Button size="sm" variant="link" className="text-purple-500 h-auto p-0 text-xs" onClick={(e) => { e.stopPropagation(); setAudioFile(null); if (audioInputRef.current) audioInputRef.current.value = ''; }}>
                      Rimuovi
                    </Button>
                  </div>
                )}
              </div>

              {/* Opzione Incolla Testo */}
              <div className={`flex flex-col h-32 sm:h-36 p-3 rounded-lg border-2 border-dashed transition-all 
                            ${isTextInputDisabled ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed' : 'border-purple-300 bg-purple-50/50'}`}>
                <ClipboardPaste className={`w-7 h-7 sm:w-8 sm:h-8 mb-1.5 self-center ${pastedText ? 'text-green-500' : isTextInputDisabled ? 'text-gray-400' : 'text-purple-600'}`} />
                <Textarea
                  placeholder="Incolla il testo qui..."
                  className={`flex-grow text-xs resize-none h-16 sm:h-20 ${isTextInputDisabled ? 'bg-gray-200 border-gray-300 placeholder:text-gray-400' : 'bg-white/70 border-purple-200 focus:border-purple-400'}`}
                  value={pastedText}
                  onChange={(e) => !isTextInputDisabled && setPastedText(e.target.value)}
                  disabled={isTextInputDisabled}
                />
                {pastedText && !isTextInputDisabled && (
                  // Rimosso il pulsante Analizza, l'analisi avverrà con "Crea Progetto"
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-2 w-full text-purple-500 h-auto p-0 text-xs"
                    onClick={() => setPastedText('')}
                  >
                    Cancella Testo
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Divisore */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-2 text-sm text-gray-500">oppure procedi manualmente</span>
            </div>
          </div>

          {/* Manual Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <Label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Target className="w-4 h-4 mr-2 text-gray-500" />
                  Titolo Progetto
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: formatToCapitalized(e.target.value) }))}
                  placeholder="Es: Landing Page E-commerce"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <Label htmlFor="client" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                  Cliente
                </Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData((prev) => ({ ...prev, client: formatToCapitalized(e.target.value) }))}
                  placeholder="Es: Rossi S.R.L."
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Budget Generale */}
            <div>
              <Label htmlFor="budget" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                Pagamento Cliente (€)
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="budget"
                type="number"
                value={budgetInputValue}
                onChange={handleBudgetInputChange}
                onBlur={handleBudgetInputBlur}
                placeholder="300"
                min="0"
                step="1"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Il budget sarà distribuito automaticamente tra i task se valido.
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4 mr-2 text-gray-500" />
                Descrizione
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: formatToCapitalized(e.target.value) }))}
                placeholder="Breve descrizione del progetto e degli obiettivi..."
                rows={3}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Tasks Section */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <Label className="flex items-center text-sm font-medium text-gray-700">
                  <ListChecks className="w-4 h-4 mr-2 text-gray-500" />
                  Task del Progetto
                </Label>
              </div>

              <div className="space-y-3 mb-4">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                  >
                    <div className="flex-1 flex items-center space-x-3">
                      <Input
                        value={task.name}
                        readOnly
                        className="flex-1 text-sm border-none focus:ring-0 p-0 bg-transparent"
                      />
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <div className="relative w-24">
                        <Clock size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <Input
                          type="number"
                          value={task.hours}
                          onChange={(e) => updateTaskHours(task.id, e.target.value)}
                          className="w-full h-8 text-sm text-center pl-6 pr-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          min="0"
                          step="1"
                        />
                      </div>
                      <div className="relative w-24">
                        <Euro size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="number"
                          value={task.price}
                          onChange={(e) => updateTaskPrice(task.id, e.target.value)}
                          className="w-full h-8 text-sm text-center pl-6 pr-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          step="1"
                          min="0"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTask(task.id)}
                        className="text-red-500 hover:bg-red-100 hover:text-red-700 p-1 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-3 flex items-center border border-dashed border-blue-400 rounded-md hover:border-blue-500 transition-colors">
                <Input
                  placeholder="Nuovo Task (es: Design UI)"
                  value={newTask.name}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, name: formatToCapitalized(e.target.value) }))}
                  className="flex-1 border-none focus:ring-0 text-sm h-10 px-3"
                />
                <div className="relative">
                  <Clock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Input
                    type="number"
                    placeholder="Ore"
                    value={newTask.hours}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, hours: e.target.value }))}
                    step="1"
                    min="0"
                    className="w-20 text-sm border-none focus:ring-0 h-10 pl-7 pr-2 text-center"
                  />
                </div>
                <div className="relative">
                  <Euro size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Input
                    type="number"
                    placeholder="€"
                    value={newTask.price}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, price: e.target.value }))}
                    step="1"
                    min="0"
                    className="w-20 text-sm border-none focus:ring-0 h-10 px-2 text-center"
                  />
                </div>
                <Button
                  onClick={addTask}
                  variant="ghost"
                  size="icon"
                  className="text-blue-600 hover:bg-blue-100 rounded-full m-1"
                  type="button"
                  disabled={!newTask.name}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {tasks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-700">
                      Budget distribuito tra {tasks.length} task:
                    </p>
                    <span className="text-lg font-bold text-green-600">€{Math.round(totalBudget)}</span>
                  </div>
                  <div className="mt-2 text-xs text-green-600">
                    {tasks.reduce((sum, task) => sum + Math.round(task.price), 0) !== Math.round(totalBudget) && (
                      <span className="text-orange-600">
                        ⚠️ Totale task: €{tasks.reduce((sum, task) => sum + Math.round(task.price), 0)} (differenza dal budget)
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
