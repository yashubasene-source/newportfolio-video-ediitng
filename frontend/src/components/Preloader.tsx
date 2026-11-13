import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Play } from 'lucide-react';
import { usePerformance } from '../motion/performanceManager';

interface PreloaderProps {
  onComplete: () => void;
  soundEnabled: boolean;
}

export default function Preloader({ onComplete, soundEnabled }: PreloaderProps) {
  const [countdown, setCountdown] = useState(3);
  const [actionTriggered, setActionTriggered] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  const { capabilities } = usePerformance();
  const isLiteMode = capabilities.mode === 'lite' || capabilities.mode === 'reduced';

  // Play synthetic beeps and clack
  const playSound = (type: 'beep' | 'clack') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      // Audio safety
    }
  };

  useEffect(() => {
    if (isSkipped) return;

    if (countdown > 0) {
      playSound('beep');
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 650);
      return () => clearTimeout(timer);
    } else {
      setActionTriggered(true);
      playSound('clack');
      const timer = setTimeout(() => {
        try {
          sessionStorage.setItem('anshay-preloader-completed', 'true');
        } catch (e) {}
        onComplete();
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [countdown, isSkipped]);

  const handleSkip = () => {
    setIsSkipped(true);
    try {
      sessionStorage.setItem('anshay-preloader-completed', 'true');
    } catch (e) {}
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        id="preloader-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: isLiteMode ? -20 : -40 }}
        transition={{ duration: isLiteMode ? 0.3 : 0.6, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#141414] text-white select-none overflow-hidden"
      >
        {/* Luminous Moss background radar atmosphere */}
        {!isLiteMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-[320px] h-[320px] rounded-full border border-[#2BEE34] animate-ping" />
            <div className="absolute w-[560px] h-[560px] rounded-full border border-[#2BEE34]/40 animate-pulse" />
          </div>
        )}

        {/* Top Production Tag */}
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={isLiteMode ? { duration: 0.3 } : { delay: 0.2, type: 'spring', stiffness: 120 }}
          className="absolute top-12 left-8 font-mono text-[10px] tracking-[4px] text-[#2BEE34] opacity-90 flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2BEE34] animate-ping" />
          <span>ANSHAY.STUDIOS — SCENE 01 / TAKE 01</span>
        </motion.div>

        {/* Main clapper structure */}
        <div className="relative flex flex-col items-center justify-center gap-8 max-w-md w-full px-8">
          
          {/* Animated Clapper Board Top */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.95 }}
            animate={actionTriggered ? { scale: 1.05 } : { scale: 1 }}
            transition={isLiteMode ? { duration: 0.2 } : { type: 'spring', damping: 10 }}
          >
            {/* Clapper Hinge / Top Bar */}
            <motion.div
              style={{ originX: 0, originY: 1 }}
              animate={actionTriggered ? { rotate: 0 } : { rotate: -22 }}
              transition={isLiteMode ? { duration: 0.2 } : { type: 'spring', stiffness: 200, damping: 15 }}
              className="w-64 h-10 border-2 border-white/20 bg-[#1A1D24] flex items-center justify-center relative overflow-hidden rounded-t-lg shadow-xl"
            >
              {/* Slanted lines pattern with subtle green glow */}
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(-45deg,#2BEE34_0px,#2BEE34_8px,#141414_8px,#141414_20px)] w-[120%]" />
            </motion.div>

            {/* Clapper Body */}
            <div className="w-64 h-36 border-2 border-t-0 border-white/20 bg-[#161820] rounded-b-lg flex flex-col justify-between p-4 shadow-[0_0_50px_rgba(43,238,52,0.18)] relative">
              <div className="flex justify-between items-center text-center text-[10px] font-mono text-slate-400 border-b border-white/10 pb-2">
                <div>
                  <span className="block text-slate-500">SCENE</span>
                  <span className="text-white font-bold tracking-wider">01</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div>
                  <span className="block text-slate-500">TAKE</span>
                  <span className="text-white font-bold tracking-wider">01</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div>
                  <span className="block text-slate-500">ROLL</span>
                  <span className="text-[#2BEE34] font-bold tracking-wider">2026</span>
                </div>
              </div>

              {/* Title inside clapper */}
              <div className="text-center my-2">
                <h2 className="font-impact text-lg tracking-wider text-white uppercase">
                  ANSHAY BASENE
                </h2>
                <p className="text-[9px] font-mono tracking-widest text-[#2BEE34]">
                  CINEMATIC EDITING PORTFOLIO
                </p>
              </div>

              <div className="text-center text-[8px] font-mono text-slate-500 tracking-wider">
                BHOPAL, INDIA • 4 FOCUS NICHES
              </div>
            </div>
          </motion.div>

          {/* Countdown Numbers and Action Display */}
          <div className="h-24 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {!actionTriggered ? (
                <motion.div
                  key={`cd-${countdown}`}
                  initial={isLiteMode ? { opacity: 0 } : { y: 30, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={isLiteMode ? { opacity: 0 } : { y: -30, opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="font-impact text-6xl sm:text-7xl font-black text-[#2BEE34] tracking-widest flex items-center gap-3 drop-shadow-[0_0_25px_rgba(43,238,52,0.7)]"
                >
                  <Film className={`w-9 h-9 text-[#2BEE34] ${isLiteMode ? '' : 'animate-spin'}`} />
                  <span>{countdown}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="action"
                  initial={isLiteMode ? { opacity: 0 } : { scale: 0.3, opacity: 0 }}
                  animate={isLiteMode ? { opacity: 1 } : { scale: [1, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <div className="font-impact text-5xl tracking-[10px] text-[#2BEE34] drop-shadow-[0_0_30px_rgba(43,238,52,0.8)] flex items-center gap-2">
                    <Play className="w-9 h-9 fill-[#2BEE34] text-[#2BEE34] stroke-0" />
                    ACTION!
                  </div>
                  <span className="text-[10px] tracking-[4px] font-mono text-[#2BEE34]/90 uppercase mt-1">
                    Loading Timeline
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Skip button in bottom corner */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          whileHover={isLiteMode ? {} : { opacity: 1, scale: 1.05 }}
          onClick={handleSkip}
          className="absolute bottom-10 px-5 py-2 rounded-full border border-white/10 text-xs text-slate-300 font-mono tracking-widest hover:border-[#2BEE34] hover:text-[#2BEE34] transition-all duration-350 bg-black/40 backdrop-blur-sm cursor-pointer shadow-lg"
        >
          SKIP COUNTDOWN &rsaquo;
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}