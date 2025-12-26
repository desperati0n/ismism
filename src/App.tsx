import { useState, useEffect, useRef } from 'react';
import { GridSlider } from './components/GridSlider';
import { SearchButton } from './components/SearchButton';
import { ResultCard } from './components/ResultCard';
import { TopNavigation } from './components/TopNavigation';
import { IsmDetail } from './components/IsmDetail';
import { WaveTextBackground } from './components/WaveTextBackground';
import { searchIsms, Ism } from './data/isms';

export default function App() {
  const [sliderValues, setSliderValues] = useState<string[]>(['1', '4', '3', '4']);
  const [searchResults, setSearchResults] = useState<Ism[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedIsm, setSelectedIsm] = useState<Ism | null>(null);
  const scrollPositionRef = useRef<number>(0);
  
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
    setSliderValues(['1', '4', '3', '4']);
    setSearchResults([]);
    setHasSearched(false);
    setSelectedIsm(null);
  };
  
  const handleIsmClick = (ism: Ism) => {
    scrollPositionRef.current = window.scrollY;
    setSelectedIsm(ism);
  };
  
  const handleBackToResults = () => {
    setSelectedIsm(null);
  };
  
  useEffect(() => {
    if (selectedIsm === null && scrollPositionRef.current > 0) {
      setTimeout(() => {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'auto',
        });
      }, 50);
    } else if (selectedIsm !== null) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [selectedIsm]);
  
  const currentSearchDisplay = sliderValues.join('-');
  
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: '#f5f5f5',
        fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', sans-serif",
      }}
    >
      {/* 波浪文字背景 */}
      <WaveTextBackground />
      
      {/* 粉红色装饰点 - 响应式大小 */}
      <div className="dot-pink dot-pink-sm md:dot-pink-md lg:dot-pink-lg" style={{ top: '20%', left: '8%' }} />
      <div className="dot-pink dot-pink-sm md:dot-pink-md lg:dot-pink-lg" style={{ top: '45%', right: '10%' }} />
      <div className="dot-pink dot-pink-sm md:dot-pink-md lg:dot-pink-lg" style={{ bottom: '25%', left: '15%' }} />
      
      {/* 顶部导航 */}
      <TopNavigation currentSearch={currentSearchDisplay} onReset={handleReset} />
      
      {/* 主内容区 - 居中白色卡片 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-20 px-4">
        <div 
          className="w-full max-w-[600px] bg-white p-8"
          style={{
            boxShadow: '0 0 0 1px #000',
          }}
        >
          {/* 标题 */}
          <h1 
            className="text-center font-black mb-8"
            style={{ fontSize: '32px', letterSpacing: '-0.02em' }}
          >
            主义主义
          </h1>
          
          {/* 搜索框显示 */}
          <div 
            className="flex items-center justify-center gap-2 mb-6 p-3"
            style={{ 
              border: '1px solid #000',
              background: '#fff',
            }}
          >
            <span className="text-gray-500 text-sm">搜索</span>
            <span className="font-mono font-bold text-lg">{currentSearchDisplay}</span>
          </div>
          
          {/* Grid Sliders */}
          <div className="flex items-center justify-center gap-3 mb-6">
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
          
          {/* 分隔线 */}
          <div className="h-px bg-black mb-6" />
          
          {/* 搜索结果 */}
          {hasSearched && selectedIsm === null && (
            <div className="animate-fadeInUp">
              {searchResults.length > 0 ? (
                <div>
                  {searchResults.map((result, index) => (
                    <ResultCard
                      key={`${result.code}-${index}`}
                      name={result.name}
                      description={result.description}
                      onClick={() => handleIsmClick(result)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">未找到匹配的主义</p>
                  <p className="text-sm">使用 $ 作为通配符扩大搜索</p>
                </div>
              )}
            </div>
          )}
          
          {/* 详情视图 */}
          {selectedIsm && (
            <IsmDetail ism={selectedIsm} onBack={handleBackToResults} />
          )}
          
          {/* 初始说明 */}
          {!hasSearched && (
            <div className="text-center text-gray-500 text-sm space-y-1">
              <p>点击数字切换哲学维度</p>
              <p><span className="text-[#ff1493]">$</span> = 主体性缺失 / 通配符</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
