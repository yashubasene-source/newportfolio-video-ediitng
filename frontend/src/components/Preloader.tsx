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
        osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch beep
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else {
        // Clapper clack sound: noise burst + low frequency pop
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      // Audio context block safeties
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
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#06050a] text-white select-none overflow-hidden"
      >
        {/* Subtle background radar circles (Only on Balanced/Full) */}
        {!isLiteMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <div className="w-[300px] h-[300px] rounded-full border border-purple-500 animate-ping" />
            <div className="absolute w-[500px] h-[500px] rounded-full border border-purple-900 animate-pulse" />
          </div>
        )}

        {/* Cinematic horizontal slate bar animations */}
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={isLiteMode ? { duration: 0.3 } : { delay: 0.2, type: 'spring', stiffness: 120 }}
          className="absolute top-12 left-6 font-mono text-[10px] tracking-[4px] text-purple-400 opacity-60"
        >
          ANSHAY.STUDIOS — SCENE 01 / TAKE 01
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
              className="w-64 h-10 border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center relative overflow-hidden rounded-t-lg"
            >
              {/* Slanted lines pattern */}
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(-45deg,#27272a,#27272a_10px,#09090b_10px,#09090b_20px)] w-[120%]" />
            </motion.div>

            {/* Clapper Body */}
            <div className="w-64 h-36 border-2 border-t-0 border-zinc-800 bg-zinc-950 rounded-b-lg flex flex-col justify-between p-4 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative">
              <div className="flex justify-between items-center text-center text-[10px] font-mono text-zinc-500 border-b border-zinc-800/80 pb-2">
                <div>
                  <span className="block text-zinc-600">SCENE</span>
                  <span className="text-white font-bold tracking-wider">01</span>
                </div>
                <div className="h-4 w-px bg-zinc-800" />
                <div>
                  <span className="block text-zinc-600">TAKE</span>
                  <span className="text-white font-bold tracking-wider">01</span>
                </div>
                <div className="h-4 w-px bg-zinc-800" />
                <div>
                  <span className="block text-zinc-600">ROLL</span>
                  <span className="text-purple-400 font-bold tracking-wider">2026</span>
                </div>
              </div>

              {/* Title inside clapper */}
              <div className="text-center my-2">
                <h2 className="font-sans font-extrabold text-sm tracking-wide text-zinc-250">
                  ANSHAY BASENE
                </h2>
                <p className="text-[9px] font-mono tracking-widest text-zinc-500">
                  PORTFOLIO SHOWCASE
                </p>
              </div>

              <div className="text-center text-[8px] font-mono text-zinc-600 tracking-wider">
                BHOPAL, INDIA
              </div>
            </div>
          </motion.div>

          {/* Countdown Numbers and Action Display */}
          <div className="h-20 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {!actionTriggered ? (
                <motion.div
                  key={`cd-${countdown}`}
                  initial={isLiteMode ? { opacity: 0 } : { y: 30, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={isLiteMode ? { opacity: 0 } : { y: -30, opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="font-mono text-5xl font-black text-purple-500 tracking-widest flex items-center gap-3 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                >
                  <Film className={`w-8 h-8 text-purple-400 ${isLiteMode ? '' : 'animate-spin'}`} />
                  {countdown}
                </motion.div>
              ) : (
                <motion.div
                  key="action"
                  initial={isLiteMode ? { opacity: 0 } : { scale: 0.3, opacity: 0 }}
                  animate={isLiteMode ? { opacity: 1 } : { scale: [1, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <div className="font-sans font-black text-4xl tracking-[10px] text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.6)] flex items-center gap-1">
                    <Play className="w-8 h-8 fill-emerald-400 text-emerald-400 stroke-0" />
                    ACTION!
                  </div>
                  <span className="text-[10px] tracking-[4px] font-mono text-emerald-500/80 uppercase mt-1">
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
          animate={{ opacity: 0.5 }}
          whileHover={isLiteMode ? {} : { opacity: 1, scale: 1.05 }}
          onClick={handleSkip}
          className="absolute bottom-10 px-5 py-2 rounded-full border border-zinc-800 text-xs text-zinc-400 font-mono tracking-widest hover:border-purple-500 transition-all duration-350 bg-black/40 backdrop-blur-sm cursor-pointer"
        >
          SKIP COUNTDOWN &rsaquo;
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
