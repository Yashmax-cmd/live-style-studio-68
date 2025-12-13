import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler, Info } from "lucide-react";

interface SizeGuideProps {
  category: string;
  selectedSize: string;
}

interface SizeInfo {
  chest: string;
  shoulders: string;
  length: string;
  sleeve: string;
  age?: string;
}

// Size measurements in cm
const sizeData: Record<string, Record<string, SizeInfo>> = {
  men: {
    XS: { chest: "86-91", shoulders: "42", length: "66", sleeve: "58" },
    S: { chest: "91-96", shoulders: "44", length: "68", sleeve: "60" },
    M: { chest: "96-101", shoulders: "46", length: "70", sleeve: "62" },
    L: { chest: "101-106", shoulders: "48", length: "72", sleeve: "64" },
    XL: { chest: "106-111", shoulders: "50", length: "74", sleeve: "66" },
    XXL: { chest: "111-116", shoulders: "52", length: "76", sleeve: "68" },
  },
  women: {
    XS: { chest: "76-81", shoulders: "36", length: "58", sleeve: "54" },
    S: { chest: "81-86", shoulders: "38", length: "60", sleeve: "55" },
    M: { chest: "86-91", shoulders: "40", length: "62", sleeve: "56" },
    L: { chest: "91-96", shoulders: "42", length: "64", sleeve: "57" },
    XL: { chest: "96-101", shoulders: "44", length: "66", sleeve: "58" },
    XXL: { chest: "101-106", shoulders: "46", length: "68", sleeve: "59" },
  },
  boys: {
    XS: { chest: "56-61", shoulders: "28", length: "42", sleeve: "38", age: "4-5 yrs" },
    S: { chest: "61-66", shoulders: "30", length: "46", sleeve: "42", age: "6-7 yrs" },
    M: { chest: "66-71", shoulders: "32", length: "50", sleeve: "46", age: "8-9 yrs" },
    L: { chest: "71-76", shoulders: "34", length: "54", sleeve: "50", age: "10-11 yrs" },
    XL: { chest: "76-81", shoulders: "36", length: "58", sleeve: "54", age: "12-13 yrs" },
  },
  girls: {
    XS: { chest: "54-59", shoulders: "27", length: "40", sleeve: "36", age: "4-5 yrs" },
    S: { chest: "59-64", shoulders: "29", length: "44", sleeve: "40", age: "6-7 yrs" },
    M: { chest: "64-69", shoulders: "31", length: "48", sleeve: "44", age: "8-9 yrs" },
    L: { chest: "69-74", shoulders: "33", length: "52", sleeve: "48", age: "10-11 yrs" },
    XL: { chest: "74-79", shoulders: "35", length: "56", sleeve: "52", age: "12-13 yrs" },
  },
};

const measurementTips = [
  { name: "Chest", description: "Measure around the fullest part of your chest, keeping the tape horizontal." },
  { name: "Shoulders", description: "Measure from one shoulder point to the other across your upper back." },
  { name: "Length", description: "Measure from the highest point of the shoulder to the desired hem." },
  { name: "Sleeve", description: "Measure from the shoulder seam to the wrist with arm slightly bent." },
];

const SizeGuide = ({ category, selectedSize }: SizeGuideProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const categoryData = sizeData[category] || sizeData.men;
  const currentSizeData = categoryData[selectedSize];
  const isKids = category === "boys" || category === "girls";

  return (
    <div className="space-y-4">
      {/* Quick size info for selected size */}
      {currentSizeData && (
        <div className="bg-secondary/50 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Ruler className="h-4 w-4 text-gold" />
              Size {selectedSize} Measurements
            </h4>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="link" size="sm" className="text-gold h-auto p-0">
                  Full Size Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Size Guide</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* How to Measure */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-gold" />
                      How to Measure
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {measurementTips.map((tip) => (
                        <div key={tip.name} className="bg-secondary/50 rounded-lg p-3">
                          <p className="font-medium text-sm text-gold">{tip.name}</p>
                          <p className="text-xs text-muted-foreground">{tip.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Size Chart */}
                  <div>
                    <h3 className="font-medium mb-3 capitalize">{category}'s Size Chart (in cm)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-2 font-medium">Size</th>
                            <th className="text-left py-3 px-2 font-medium">Chest</th>
                            <th className="text-left py-3 px-2 font-medium">Shoulders</th>
                            <th className="text-left py-3 px-2 font-medium">Length</th>
                            <th className="text-left py-3 px-2 font-medium">Sleeve</th>
                            {isKids && <th className="text-left py-3 px-2 font-medium">Age</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(categoryData).map(([size, data]) => (
                            <tr 
                              key={size} 
                              className={`border-b border-border/50 ${
                                size === selectedSize ? "bg-gold/10" : ""
                              }`}
                            >
                              <td className={`py-3 px-2 font-medium ${size === selectedSize ? "text-gold" : ""}`}>
                                {size}
                              </td>
                              <td className="py-3 px-2 text-muted-foreground">{data.chest}</td>
                              <td className="py-3 px-2 text-muted-foreground">{data.shoulders}</td>
                              <td className="py-3 px-2 text-muted-foreground">{data.length}</td>
                              <td className="py-3 px-2 text-muted-foreground">{data.sleeve}</td>
                              {isKids && data.age && (
                                <td className="py-3 px-2 text-muted-foreground">{data.age}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Fit Tips */}
                  <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-gold">Fit Tips</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• If you're between sizes, we recommend sizing up for a relaxed fit</li>
                      <li>• For a slim fit, choose your regular size</li>
                      <li>• Measure a garment that fits you well and compare with our chart</li>
                      {isKids && <li>• Age ranges are approximate; always check measurements</li>}
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-2 bg-background/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Chest</p>
              <p className="font-medium text-sm">{currentSizeData.chest} cm</p>
            </div>
            <div className="text-center p-2 bg-background/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Shoulders</p>
              <p className="font-medium text-sm">{currentSizeData.shoulders} cm</p>
            </div>
            <div className="text-center p-2 bg-background/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Length</p>
              <p className="font-medium text-sm">{currentSizeData.length} cm</p>
            </div>
            <div className="text-center p-2 bg-background/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Sleeve</p>
              <p className="font-medium text-sm">{currentSizeData.sleeve} cm</p>
            </div>
          </div>
          
          {isKids && currentSizeData.age && (
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Recommended age: {currentSizeData.age}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SizeGuide;
