import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, Upload, RefreshCw, Download, ArrowLeft, Clock, MapPin, Plus,
  Landmark, Crown, Sailboat, Palette, Ship, Book, Building, Coffee, Train, Music, Car, 
  Mountain, Trees, Sun, ShoppingBag, Mic, Dumbbell 
} from 'lucide-react';
import { ERAS } from './constants';
import { AppState, Scene } from './types';
import { generateTimeTravelImage } from './services/geminiService';
import Footer from './components/Footer';

// Dynamic Icon Mapping
const IconMap: Record<string, React.ElementType> = {
  Landmark, Crown, Sailboat, Palette, Ship, Book, Building, Coffee, Train, Music, Car, 
  Mountain, Trees, Sun, ShoppingBag, Mic, Dumbbell, MapPin
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [customScenePrompt, setCustomScenePrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // --- ANALYTICS: Log Visit ---
  useEffect(() => {
    const logVisit = async () => {
      try {
        await fetch('/api/log-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (e) {
        // Silently fail for analytics if network error
        console.error('Analytics error:', e);
      }
    };

    logVisit();
  }, []); // Run once on mount

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("No se pudo acceder a la cámara. Por favor verifica los permisos.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
        setAppState('SELECT');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setAppState('SELECT');
      };
      reader.readAsDataURL(file);
    }
  };

  // --- NAVIGATION HANDLERS ---
  const resetApp = () => {
    stopCamera();
    setCapturedImage(null);
    setResultImage(null);
    setSelectedScene(null);
    setCustomScenePrompt('');
    setError(null);
    setAppState('HOME');
  };

  const goToSelection = () => {
    setAppState('SELECT');
  };

  // --- API INTERACTION ---
  const handleGenerate = async (scene: Scene, isCustom: boolean = false) => {
    if (!capturedImage) return;

    setSelectedScene(scene);
    setAppState('PROCESSING');
    setIsProcessing(true);
    setError(null);

    try {
      // Use the scene's prompt OR the custom prompt input by user
      const promptToUse = isCustom ? customScenePrompt : scene.prompt;
      
      const generatedImage = await generateTimeTravelImage(capturedImage, promptToUse);
      setResultImage(generatedImage);
      setAppState('RESULT');
    } catch (err: any) {
      console.error(err);
      setError("Error al viajar en el tiempo. Inténtalo de nuevo. " + (err.message || ""));
      setAppState('SELECT');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomGenerate = () => {
    if (!customScenePrompt.trim()) {
      setError("Por favor describe el lugar primero.");
      return;
    }
    const customScene: Scene = {
      id: 'custom',
      name: 'Otro Lugar',
      prompt: customScenePrompt,
      icon: 'MapPin'
    };
    handleGenerate(customScene, true);
  };

  // --- RENDER HELPERS ---
  const renderIcon = (iconName: string) => {
    const IconComponent = IconMap[iconName] || MapPin;
    return <IconComponent className="w-6 h-6" />;
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-chrono-500 blur-[60px] opacity-20 rounded-full"></div>
        <Clock className="w-24 h-24 text-chrono-gold relative z-10 animate-pulse-slow" />
      </div>
      <h1 className="text-5xl md:text-6xl font-bold title-font text-white mb-4 drop-shadow-lg">
        Aitor ChronoSnap
      </h1>
      <p className="text-chrono-300 text-lg md:text-xl max-w-2xl mb-12">
        Sube tu foto o captura el momento, y nuestra tecnología cuántica te transportará 
        al Antiguo Egipto, a los locos años 20, o donde tu imaginación desee.
      </p>
      
      <button 
        onClick={() => setAppState('CAPTURE')}
        className="group relative px-8 py-4 bg-chrono-gold text-chrono-900 text-xl font-bold rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.5)]"
      >
        <span className="flex items-center gap-2">
          Comenzar Aventura <Clock className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"/>
        </span>
      </button>
    </div>
  );

  const renderCapture = () => (
    <div className="flex flex-col items-center justify-center h-full px-4 w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 title-font">Adquisición de Imagen</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Camera Option */}
        <div className="bg-chrono-800 p-6 rounded-2xl border border-chrono-700 flex flex-col items-center shadow-xl">
          <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden mb-4">
            {!stream ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <Camera className="w-16 h-16 opacity-50" />
              </div>
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          {!stream ? (
            <button 
              onClick={startCamera}
              className="w-full py-3 bg-chrono-500 hover:bg-chrono-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" /> Activar Cámara
            </button>
          ) : (
            <button 
              onClick={takePhoto}
              className="w-full py-3 bg-chrono-gold hover:bg-white text-chrono-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" /> Capturar Foto
            </button>
          )}
        </div>

        {/* Upload Option */}
        <div className="bg-chrono-800 p-6 rounded-2xl border border-chrono-700 flex flex-col items-center justify-center shadow-xl">
          <div className="w-full h-full min-h-[300px] border-2 border-dashed border-chrono-500 rounded-lg flex flex-col items-center justify-center bg-chrono-900/50 hover:bg-chrono-900 transition-colors relative cursor-pointer group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-16 h-16 text-chrono-500 mb-4 group-hover:text-chrono-300 transition-colors" />
            <p className="text-chrono-300 font-medium group-hover:text-white">Subir archivo de imagen</p>
            <p className="text-chrono-500 text-sm mt-2">JPG, PNG, WebP</p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={resetApp}
        className="mt-8 text-chrono-300 hover:text-white flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Inicio
      </button>
    </div>
  );

  const renderSelection = () => (
    <div className="flex flex-col items-center h-full w-full max-w-6xl mx-auto px-4 pb-12">
      <div className="flex items-center justify-between w-full mb-8 pt-4">
        <h2 className="text-3xl font-bold text-white title-font">Elige tu Destino</h2>
        <button onClick={resetApp} className="text-xs text-chrono-300 hover:text-white border border-chrono-700 px-3 py-1 rounded-full">
          Cancelar
        </button>
      </div>

      <div className="w-full space-y-8 overflow-y-auto pr-2 custom-scrollbar">
        {ERAS.map((era) => (
          <div key={era.id} className="animate-fade-in-up">
            <h3 className="text-xl text-chrono-gold font-semibold mb-4 border-b border-chrono-700 pb-2">{era.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {era.scenes.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => handleGenerate(scene)}
                  className="bg-chrono-800 hover:bg-chrono-700 border border-chrono-700 hover:border-chrono-gold p-4 rounded-xl transition-all group text-left flex flex-col h-full shadow-lg"
                >
                  <div className="bg-chrono-900/50 p-3 rounded-lg w-fit mb-3 group-hover:text-chrono-gold transition-colors">
                     {renderIcon(scene.icon)}
                  </div>
                  <span className="font-medium text-white group-hover:text-chrono-gold">{scene.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Custom Input Section */}
        <div className="bg-chrono-800/50 border border-chrono-500 p-6 rounded-2xl mt-8">
          <h3 className="text-xl text-white font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-chrono-gold" /> Otro Lugar (Personalizado)
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={customScenePrompt}
              onChange={(e) => setCustomScenePrompt(e.target.value)}
              placeholder="Ej: Caminando por la superficie de Marte en un traje espacial..."
              className="flex-1 bg-chrono-900 border border-chrono-600 rounded-lg px-4 py-3 text-white placeholder-chrono-500 focus:outline-none focus:border-chrono-gold transition-colors"
            />
            <button
              onClick={handleCustomGenerate}
              className="bg-chrono-gold hover:bg-white text-chrono-900 font-bold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
            >
              Viajar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-chrono-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-chrono-gold rounded-full border-t-transparent animate-spin"></div>
        <Clock className="absolute inset-0 m-auto w-12 h-12 text-white animate-pulse" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2 title-font">Calibrando el Flujo Temporal...</h2>
      <p className="text-chrono-300 animate-pulse">Integrando tu presencia en la historia...</p>
      {selectedScene && (
        <p className="mt-4 text-chrono-gold text-sm uppercase tracking-widest">
          Destino: {selectedScene.name}
        </p>
      )}
    </div>
  );

  const renderResult = () => (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-5xl mx-auto px-4 py-8">
       <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-3xl font-bold text-white title-font">¡Llegada Exitosa!</h2>
        <button onClick={resetApp} className="text-sm text-chrono-300 hover:text-white flex items-center gap-1">
          <RefreshCw className="w-4 h-4" /> Nuevo Viaje
        </button>
      </div>

      <div className="relative bg-chrono-800 p-2 rounded-2xl shadow-2xl border border-chrono-600 max-h-[60vh] flex justify-center mb-8">
        {resultImage ? (
          <img src={resultImage} alt="Time Travel Result" className="max-w-full max-h-full rounded-xl object-contain" />
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-red-400">Error al cargar la imagen.</div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {resultImage && (
          <a 
            href={resultImage} 
            download={`aitor-chronosnap-${Date.now()}.jpg`}
            className="px-6 py-3 bg-chrono-500 hover:bg-chrono-400 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
          >
            <Download className="w-5 h-5" /> Descargar Recuerdo
          </a>
        )}
        <button
          onClick={goToSelection}
          className="px-6 py-3 bg-chrono-gold hover:bg-white text-chrono-900 font-bold rounded-lg transition-colors shadow-lg"
        >
          Probar Otro Destino
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-chrono-900 text-gray-100 flex flex-col font-sans overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-chrono-800 via-chrono-900 to-black">
      {/* Header/Nav for consistent branding on sub-pages */}
      {appState !== 'HOME' && (
        <header className="px-6 py-4 flex items-center justify-between bg-chrono-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-chrono-800">
          <div className="text-xl font-bold title-font text-white cursor-pointer" onClick={resetApp}>Aitor ChronoSnap</div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-grow relative flex flex-col">
        {error && (
          <div className="absolute top-4 left-0 right-0 mx-auto w-max max-w-[90%] bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-bounce">
             <span>⚠️ {error}</span>
             <button onClick={() => setError(null)} className="ml-2 font-bold">✕</button>
          </div>
        )}

        {appState === 'HOME' && renderHome()}
        {appState === 'CAPTURE' && renderCapture()}
        {appState === 'SELECT' && renderSelection()}
        {appState === 'PROCESSING' && renderProcessing()}
        {appState === 'RESULT' && renderResult()}
      </main>

      <Footer />
    </div>
  );
};

export default App;