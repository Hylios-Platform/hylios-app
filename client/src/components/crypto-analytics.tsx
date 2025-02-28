import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function CryptoAnalytics() {
  const { t } = useTranslation();
  const [trend, setTrend] = useState<"up" | "down">("up");
  
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-gradient-to-br from-white/80 via-blue-50/30 to-blue-100/20 border-blue-50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100/30">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-blue-400" />
          {t('features.cryptoAnalytics.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">{t('features.cryptoAnalytics.currentRate')}</h3>
            <p className="text-3xl font-bold text-blue-400">€39,876</p>
          </div>
          <motion.div
            animate={{ 
              scale: [0.95, 1.05, 0.95],
              rotate: trend === "up" ? [0, 5, 0] : [0, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {trend === "up" ? (
              <TrendingUp className="h-8 w-8 text-emerald-400" />
            ) : (
              <TrendingDown className="h-8 w-8 text-rose-400" />
            )}
          </motion.div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">{t('features.cryptoAnalytics.prediction')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">1h</span>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300"
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
              <span className="text-emerald-500">+2.3%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">24h</span>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300"
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
              <span className="text-emerald-500">+5.8%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">7d</span>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300"
                    initial={{ width: 0 }}
                    animate={{ width: "45%" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                  />
                </div>
              </div>
              <span className="text-rose-500">-1.2%</span>
            </div>
          </div>
        </div>

        <motion.div 
          className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-semibold text-gray-800 mb-2">{t('features.cryptoAnalytics.trend')}</h3>
          <p className="text-sm text-gray-600">
            Tendência de alta nas próximas 24h com 78% de confiança. Momento favorável para receber pagamentos.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
