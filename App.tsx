import { useState } from 'react';
import { GridSlider } from './components/GridSlider';
import { SearchButton } from './components/SearchButton';
import { ResultCard } from './components/ResultCard';
import { TopNavigation } from './components/TopNavigation';
import { searchIsms, Ism } from './data/isms';
import './styles/globals.css';

export default function App() {
  const [sliderValues, setSliderValues] = useState<string[]>(['1', '2', '3', '4']);
  const [searchResults, setSearchResults] = useState<Ism[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSliderChange = (index: number, value: string) => {
    const newValues = [...sliderValues];
    newValues[index] = value;
    setSliderValues(newValues);
  };
  
  const handleSearch = () => {
    const searchCode = sliderValues.join('-');
    const results = searchIsms(searchCode);
    setSearchResults(results);
    setHasSearched(true);
  };
  
  const handleReset = () => {
    setSliderValues(['1', '2', '3', '4']);
    setSearchResults([]);
    setHasSearched(false);
  };
  
  const currentSearchDisplay = sliderValues.join('-');
  
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: '#0f0f1a',
        fontFamily: "'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* Top Navigation */}
      <TopNavigation currentSearch={currentSearchDisplay} onReset={handleReset} />
      
      {/* Main Content */}
      <div className="pt-32 pb-16 px-8">
        <div className="max-w-[1920px] mx-auto">
          {/* Grid Sliders + Search Button */}
          <div className="flex items-center justify-center gap-6 mb-16">
            {sliderValues.map((value, index) => (
              <GridSlider
                key={index}
                index={index}
                value={value}
                onChange={(newValue) => handleSliderChange(index, newValue)}
              />
            ))}
            <SearchButton onClick={handleSearch} />
          </div>
          
          {/* Search Results */}
          {hasSearched && (
            <div className="flex flex-col items-center gap-4">
              {searchResults.length > 0 ? (
                <>
                  <div className="text-white/70 mb-4 text-base">
                    找到 {searchResults.length} 个匹配的主义
                  </div>
                  {searchResults.map((result, index) => (
                    <ResultCard
                      key={`${result.code}-${index}`}
                      name={result.name}
                      description={result.description}
                    />
                  ))}
                </>
              ) : (
                <div className="text-white/50 text-center mt-8">
                  <p className="mb-2 text-base">未找到匹配的主义</p>
                  <p className="text-sm">
                    尝试调整格子中的值或使用通配符 $ 来扩大搜索范围
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Initial State - Show instruction */}
          {!hasSearched && (
            <div className="text-center text-white/50 mt-16">
              <p className="mb-4 text-base">滑动格子选择元素，然后点击搜索按钮</p>
              <div className="text-sm space-y-2">
                <p>• 数字 1, 2, 3, 4 代表不同的哲学维度</p>
                <p>• <span className="text-[#FF6B6B]">第一个格子的 $</span> 代表"主体性缺失"</p>
                <p>• <span className="text-[#FFD700]">其他格子的 $</span> 作为通配符使用</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(74, 144, 226, 0.03) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}

