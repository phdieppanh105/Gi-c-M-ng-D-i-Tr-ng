import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Moon, Cloud, Heart } from 'lucide-react';

export const MoonBanner: React.FC = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative w-full max-w-4xl mx-auto px-4 pt-8 pb-4 text-center select-none"
    >
      {/* Decorative Cloud & Moon Badge */}
      <div className="relative inline-block mb-4">
        <div className="absolute -top-3 -left-3 text-[#ffb74d] animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute -bottom-2 -right-3 text-[#f48fb1] animate-bounce" style={{ animationDuration: '3.5s' }}>
          <Heart className="w-3.5 h-3.5 fill-[#fce4ec] text-[#f48fb1]" />
        </div>

        {/* Soft Moon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-[#e1f5fe] shadow-2xs text-[#5d6d7e] text-xs font-semibold tracking-wide">
          <Moon className="w-3.5 h-3.5 text-[#fb8c00] animate-pulse" />
          <span>Thế Giới Gamebook & Cốt Truyện Tương Tác</span>
          <Cloud className="w-3.5 h-3.5 text-[#90caf9]" />
        </div>
      </div>

      {/* Main Required Greeting Heading from Natural Tones Spec */}
      <div className="relative mb-3.5">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-[#4a5568] tracking-tight leading-relaxed px-2 drop-shadow-xs">
          ⋆｡ ﾟ☁︎｡ Chào Mừng Các Bảo Bối Đã Đến Với Giấc Mộng Dưới Trăng ｡ ﾟ☾ ﾟ｡ ⋆
        </h2>
      </div>

      {/* Required Slogan from Natural Tones Spec */}
      <div className="max-w-2xl mx-auto">
        <p className="text-base sm:text-lg italic text-[#90a4ae] font-serif tracking-wide leading-relaxed">
          “Trăng nghiêng một bóng bên thềm. Soi vào đáy mắt, dịu êm một đời.”
        </p>
      </div>

      {/* Natural Tones divider */}
      <div className="flex items-center justify-center gap-3 mt-5 text-[#cfd8dc]">
        <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#cfd8dc]" />
        <span className="text-xs text-[#b0bec5]">✦ ☾ ✦</span>
        <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#cfd8dc]" />
      </div>
    </motion.section>
  );
};
