import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw } from 'lucide-react';
import { Label } from '../components/ui/label';

const Fraction = ({ numerator, denominator, className = "", inputMode = false }) => {
  if (inputMode) {
    return (
      <div className={`inline-block text-center align-middle py-2 ${className}`}>
        <div>
          {typeof numerator === 'string' ? numerator : (
            <div className="inline-flex items-start">
              <span className="border-b border-black">{numerator.props.children[0]}</span>
              {numerator.props.children[1]}
            </div>
          )}
        </div>
        <div>
          {typeof denominator === 'string' ? denominator : (
            <div className="inline-flex items-start">
              <span>{denominator.props.children[0]}</span>
              {denominator.props.children[1]}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`inline-block text-center align-middle py-2 ${className}`}>
      <div className="border-b border-black">{numerator}</div>
      <div>{denominator}</div>
    </div>
  );
};

const PowerFraction = ({ numerator, denominator, power }) => (
  <div className="inline-flex items-center">
    <div className="flex items-center relative">
      <div className="text-4xl absolute -left-3 h-full flex items-center -mt-4" style={{ transform: 'scale(1, 2)' }}>(</div>
      <div className="px-1">
        <Fraction numerator={numerator} denominator={denominator} />
      </div>
      <div className="text-4xl absolute -right-3 h-full flex items-center -mt-4" style={{ transform: 'scale(1, 2)' }}>)</div>
    </div>
    <sup className="ml-3 text-lg -mt-6 inline-block">{power}</sup>
  </div>
);

const QuotientPowerProperty = () => {
  // State management
  const [numbers, setNumbers] = useState({ num: 3, den: 4, power: 2 });
  const [showSteps, setShowSteps] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({
    step1Num: '',
    step1Den: '',
    step2: ''
  });
  const [inputStatus, setInputStatus] = useState({
    step1Num: null,
    step1Den: null,
    step2: null
  });
  const [stepCompleted, setStepCompleted] = useState({
    step1: false,
    step2: false
  });
  const [stepSkipped, setStepSkipped] = useState({
    step1: false,
    step2: false
  });
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState(null);
  const [inputError, setInputError] = useState('');

  // Generate random numbers
  const generateNumbers = () => {
    const num = Math.floor(Math.random() * 9) + 2;
    const den = Math.floor(Math.random() * 9) + 2;
    const power = Math.floor(Math.random() * 8) + 2;
    setNumbers({ num, den, power });
    setInputError('');
    setShowSteps(false);
  };

  // Show navigation buttons when all steps are completed
  useEffect(() => {
    if (stepCompleted.step1 && stepCompleted.step2) {
      setShowNavigationButtons(true);
    }
  }, [stepCompleted]);

  // Handle input changes
  const handleNumberChange = (e, field) => {
    const value = e.target.value;
    let clampedValue = value;
    if (value && !isNaN(value)) {
      const maxValue = field === 'power' ? 9 : 10;
      const minValue = field === 'power' ? 2 : 1;
      clampedValue = Math.max(minValue, Math.min(parseInt(value), maxValue));
    }
    
    setNumbers(prev => ({
      ...prev,
      [field]: clampedValue ? parseInt(clampedValue) : prev[field]
    }));
    setInputError('');
    setShowSteps(false);
  };

  // Validate inputs before calculating
  const validateInputs = () => {
    const { num, den, power } = numbers;
    if (!num || !den || !power) {
      return false;
    }
    if (num < 1 || den < 1 || power < 2) {
      return false;
    }
    return true;
  };

  // Calculate steps
  const calculateSteps = () => {
    if (!validateInputs()) {
      setInputError('Please enter valid numbers (numerator/denominator: 1-10, power: 2-9)');
      return;
    }

    setShowSteps(true);
    setUserInputs({ step1Num: '', step1Den: '', step2: '' });
    setCurrentStepIndex(0);
    setStepCompleted({ step1: false, step2: false });
    setInputStatus({ step1Num: null, step1Den: null, step2: null });
    setShowNavigationButtons(false);
  };

  // Handle step input change
  const handleStepInputChange = (e, field) => {
    setUserInputs({ ...userInputs, [field]: e.target.value });
    setInputStatus({ ...inputStatus, [field]: null });
  };

  // Skip step
  const skipStep = (step) => {
    if (step === 'step1') {
      setUserInputs(prev => ({ ...prev, step1Num: numbers.power.toString(), step1Den: numbers.power.toString() }));
      setInputStatus(prev => ({ ...prev, step1Num: 'correct', step1Den: 'correct' }));
      setStepCompleted(prev => ({ ...prev, step1: true }));
      setStepSkipped(prev => ({ ...prev, step1: true }));
      return;
    }
    let answer = '';
    if (step === 'step2') {
      const numResult = Math.pow(numbers.num, numbers.power);
      const denResult = Math.pow(numbers.den, numbers.power);
      answer = `${numResult}/${denResult}`;
    }
    
    setUserInputs({ ...userInputs, [step]: answer });
    setInputStatus({ ...inputStatus, [step]: 'correct' });
    setStepCompleted(prev => ({ ...prev, [step]: true }));
    setStepSkipped(prev => ({ ...prev, [step]: true }));
  };

  // Check step answer
  const checkStep = (step) => {
    if (step === 'step1') {
      const numCorrect = parseInt(userInputs.step1Num) === numbers.power;
      const denCorrect = parseInt(userInputs.step1Den) === numbers.power;
      setInputStatus(prev => ({
        ...prev,
        step1Num: numCorrect ? 'correct' : 'incorrect',
        step1Den: denCorrect ? 'correct' : 'incorrect'
      }));
      if (numCorrect && denCorrect) {
        setStepCompleted(prev => ({ ...prev, step1: true }));
        setStepSkipped(prev => ({ ...prev, step1: false }));
      }
      return;
    }
    let isCorrect = false;
    const userAnswer = userInputs[step];
    
    if (step === 'step2') {
      const [numResult, denResult] = userAnswer.split('/').map(Number);
      const correctNumResult = Math.pow(numbers.num, numbers.power);
      const correctDenResult = Math.pow(numbers.den, numbers.power);
      isCorrect = numResult === correctNumResult && denResult === correctDenResult;
    }

    setInputStatus({ ...inputStatus, [step]: isCorrect ? 'correct' : 'incorrect' });
    
    if (isCorrect) {
      setStepCompleted(prev => ({ ...prev, [step]: true }));
      setStepSkipped(prev => ({ ...prev, [step]: false }));
    }
  };

  // Handle navigation
  const handleNavigateHistory = (direction) => {
    setNavigationDirection(direction);
    
    if (direction === 'back' && currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (direction === 'forward' && currentStepIndex < 1) {
      setCurrentStepIndex(prev => prev + 1);
    }

    setTimeout(() => {
      setNavigationDirection(null);
    }, 300);
  };

  const steps = [
    {
      main: 'Step 1: Apply the power to both numerator and denominator',
      formula: (
        <div className="flex items-center gap-3 text-lg p-4">
          <PowerFraction 
            numerator={numbers.num}
            denominator={numbers.den}
            power={numbers.power}
          />
          <span>=</span>
          {stepCompleted.step1 ? (
            <div className="text-[#008545] font-medium">
              <Fraction 
                numerator={<span>{numbers.num}<sup>{numbers.power}</sup></span>}
                denominator={<span>{numbers.den}<sup>{numbers.power}</sup></span>}
              />
            </div>
          ) : (
            <Fraction 
              numerator={
                <div className="inline-flex items-start relative pb-2">
                  <span>{numbers.num}</span>
                  <input
                    type="number"
                    value={userInputs.step1Num || ''}
                    onChange={(e) => handleStepInputChange(e, 'step1Num')}
                    className={`no-spin w-8 h-6 absolute -mt-2 ml-3 p-0 text-center text-sm border rounded ${
                      inputStatus.step1Num === 'correct'
                        ? 'border-green-500'
                        : inputStatus.step1Num === 'incorrect'
                        ? 'border-yellow-500'
                        : 'border-gray-300'
                    }`}
                    min="1"
                    max="12"
                  />
                </div>
              }
              denominator={
                <div className="inline-flex items-start relative mt-3">
                  <span>{numbers.den}</span>
                  <input
                    type="number"
                    value={userInputs.step1Den || ''}
                    onChange={(e) => handleStepInputChange(e, 'step1Den')}
                    className={`no-spin w-8 h-6 absolute -mt-2 ml-3 p-0 text-center text-sm border rounded ${
                      inputStatus.step1Den === 'correct'
                        ? 'border-green-500'
                        : inputStatus.step1Den === 'incorrect'
                        ? 'border-yellow-500'
                        : 'border-gray-300'
                    }`}
                    min="1"
                    max="12"
                  />
                </div>
              }
            />
          )}
        </div>
      ),
      answer: numbers.power.toString()
    },
    {
      main: 'Step 2: Calculate the powers',
      formula: (
        <div className="flex items-center justify-center gap-3 text-lg">
          <Fraction 
            numerator={<span>{numbers.num}<sup>{numbers.power}</sup></span>}
            denominator={<span>{numbers.den}<sup>{numbers.power}</sup></span>}
          />
          <span>=</span>
          {stepCompleted.step2 ? (
            <div className="text-[#008545] font-medium">
              <Fraction 
                numerator={Math.pow(numbers.num, numbers.power)}
                denominator={Math.pow(numbers.den, numbers.power)}
              />
            </div>
          ) : (
            <Fraction 
              numerator={`?`}
              denominator={`?`}
            />
          )}
        </div>
      ),
      answer: `${Math.pow(numbers.num, numbers.power)}/${Math.pow(numbers.den, numbers.power)}`
    }
  ];

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: #fff;
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }

        .nav-button {
          opacity: 1;
          cursor: default !important;
          position: relative;
          z-index: 2;
          outline: 2px white solid;
        }

        .nav-button-orbit {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          z-index: 0;
        }

        .nav-button-orbit::before {
          content: "";
          position: absolute;
          inset: 2px;
          background: transparent;
          border-radius: 50%;
          z-index: 0;
        }

        .nav-button svg {
          position: relative;
          z-index: 1;
        }

        .no-spin::-webkit-outer-spin-button, .no-spin::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .no-spin[type=number] { -moz-appearance: textfield; }
      `}</style>
      <div className="w-[500px] h-auto mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden select-none">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">Power of Quotients Property</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Numerator</label>
                <input
                  type="number"
                  value={numbers.num}
                  onChange={(e) => handleNumberChange(e, 'num')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5750E3]"
                  placeholder="Numerator"
                  min="1"
                  max="10"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Denominator</label>
                <input
                  type="number"
                  value={numbers.den}
                  onChange={(e) => handleNumberChange(e, 'den')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5750E3]"
                  placeholder="Denominator"
                  min="1"
                  max="10"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Exponent</label>
                <input
                  type="number"
                  value={numbers.power}
                  onChange={(e) => handleNumberChange(e, 'power')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5750E3]"
                  placeholder="Power"
                  min="2"
                  max="9"
                />
              </div>
              <Button 
                onClick={generateNumbers}
                className="bg-[#008545] hover:bg-[#00703d] text-white px-4 mt-6 h-[42px]"
              >
                Random
              </Button>
            </div>

            {inputError && (
              <p className="text-sm text-red-500">{inputError}</p>
            )}

            <div className="text-center text-2xl flex items-center justify-center h-20 mb-4">
              <PowerFraction 
                numerator={numbers.num}
                denominator={numbers.den}
                power={numbers.power}
              />
            </div>

            <div className={`glow-button ${!showSteps ? 'simple-glow' : 'simple-glow stopped'}`}>
              <button 
                onClick={calculateSteps}
                className="w-full bg-[#008545] hover:bg-[#00703d] text-white text-sm py-2 rounded"
              >
                Solve Step by Step
              </button>
            </div>
          </div>
        </div>

        {showSteps && (
          <div className="p-4 bg-gray-50">
            <div className="space-y-2">
              <h3 className="text-[#5750E3] text-sm font-medium mb-2">
                Steps to solve the power of quotients:
              </h3>
              <div className="space-y-4">
                <div className="w-full p-2 mb-1 bg-white border border-[#5750E3]/30 rounded-md">
                  <p className="text-sm">{steps[currentStepIndex].main}</p>
                  <div className="mt-1">
                    {typeof steps[currentStepIndex].formula === 'string' ? (
                      <pre className="text-sm whitespace-pre-wrap">{steps[currentStepIndex].formula}</pre>
                    ) : (
                      steps[currentStepIndex].formula
                    )}
                  </div>
                  {!stepCompleted[`step${currentStepIndex + 1}`] && currentStepIndex === 0 && (
                    <div className="flex gap-4 mt-4 justify-end">
                      <div className="glow-button simple-glow">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => checkStep(`step${currentStepIndex + 1}`)} 
                            className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                          >
                            Check
                          </button>
                          <button 
                            onClick={() => skipStep(`step${currentStepIndex + 1}`)} 
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md min-w-[80px]"
                          >
                            Skip
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {!stepCompleted[`step${currentStepIndex + 1}`] && currentStepIndex === 1 && (
                    <div className="flex items-center space-x-1 mt-2">
                      <input
                        type="text"
                        value={userInputs[`step${currentStepIndex + 1}`]}
                        onChange={(e) => handleStepInputChange(e, `step${currentStepIndex + 1}`)}
                        placeholder="Enter as num/den"
                        className={`w-full text-sm p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#5750E3] ${
                          inputStatus[`step${currentStepIndex + 1}`] === 'correct'
                            ? 'border-green-500'
                            : inputStatus[`step${currentStepIndex + 1}`] === 'incorrect'
                            ? 'border-yellow-500'
                            : 'border-gray-300'
                        }`}
                      />
                      <div className="glow-button simple-glow">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => checkStep(`step${currentStepIndex + 1}`)} 
                            className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                          >
                            Check
                          </button>
                          <button 
                            onClick={() => skipStep(`step${currentStepIndex + 1}`)} 
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md min-w-[80px]"
                          >
                            Skip
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {stepCompleted[`step${currentStepIndex + 1}`] && !showNavigationButtons && (
                    <div className="flex items-center gap-4 mt-2 justify-end">
                      {!stepSkipped[`step${currentStepIndex + 1}`] && (
                        <span className="text-green-600 font-bold select-none">Great Job!</span>
                      )}
                      {currentStepIndex < steps.length - 1 && (
                        <div className="glow-button simple-glow">
                          <button 
                            onClick={() => {
                              if (currentStepIndex < steps.length - 1) {
                                setCurrentStepIndex(prev => prev + 1);
                              }
                            }}
                            className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                          >
                            Continue
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <div
                    className="nav-orbit-wrapper"
                    style={{
                      position: 'relative',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      visibility: showNavigationButtons && currentStepIndex > 0 ? 'visible' : 'hidden',
                      opacity: showNavigationButtons && currentStepIndex > 0 ? 1 : 0,
                      pointerEvents: showNavigationButtons && currentStepIndex > 0 ? 'auto' : 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    <div className="nav-button-orbit"></div>
                    <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                    <button
                      onClick={() => handleNavigateHistory('back')}
                      className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6"/>
                      </svg>
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 min-w-[100px] text-center">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                  <div
                    className="nav-orbit-wrapper"
                    style={{
                      position: 'relative',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      visibility: showNavigationButtons && currentStepIndex < steps.length - 1 ? 'visible' : 'hidden',
                      opacity: showNavigationButtons && currentStepIndex < steps.length - 1 ? 1 : 0,
                      pointerEvents: showNavigationButtons && currentStepIndex < steps.length - 1 ? 'auto' : 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    <div className="nav-button-orbit"></div>
                    <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                    <button
                      onClick={() => handleNavigateHistory('forward')}
                      className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default QuotientPowerProperty;