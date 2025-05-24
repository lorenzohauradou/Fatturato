import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AIFeatureIndicatorProps {
  text?: string;
  className?: string;
}

export default function AIFeatureIndicator({
  text = "AI",
  className = "",
}: AIFeatureIndicatorProps) {
  return (
    <motion.div
      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-semibold
                  bg-gradient-to-r from-amber-500/90 to-orange-500 text-white
                  shadow ${className}`}
      initial={{ opacity: 0, y: -10, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 15 }}
      title="Funzionalità AI disponibili"
    >
      <Sparkles className="w-3 h-3" />
      <span>{text}</span>
    </motion.div>
  );
}
