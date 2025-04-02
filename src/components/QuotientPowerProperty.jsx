import React, { useState } from 'react';
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
  const generateNumbers = () => {
    const num = Math.floor(Math.random() * 9) + 2;
    const den = Math.floor(Math.random() * 9) + 2;
    const power = Math.floor(Math.random() * 2) + 2;
    return { num, den, power };
  };

  const [numbers, setNumbers] = useState(generateNumbers());
  const [showAnswer, setShowAnswer] = useState(false);
  const [solutionNumbers, setSolutionNumbers] = useState(generateNumbers());
  const [step1Complete, setStep1Complete] = useState(false);
  const [step2Complete, setStep2Complete] = useState(false);
  const [step1Inputs, setStep1Inputs] = useState({
    numeratorPower: '',
    denominatorPower: ''
  });
  const [step2Inputs, setStep2Inputs] = useState({
    numeratorResult: '',
    denominatorResult: ''
  });
  const [hasError, setHasError] = useState({
    numerator: false,
    denominator: false,
    numeratorResult: false,
    denominatorResult: false
  });
  const [inputs, setInputs] = useState({
    numerator: "",
    denominator: "",
    power: ""
  });

  const handleInputChange = (field, value) => {
    let updateField = field;
    if (field === 'numerator') updateField = 'num';
    if (field === 'denominator') updateField = 'den';
    
    let clampedValue = value;
    if (value && !isNaN(value)) {
      const maxValue = field === 'power' ? 3 : 10;
      const minValue = field === 'power' ? 2 : 1;
      clampedValue = Math.max(minValue, Math.min(parseInt(value), maxValue));
    }
    
    const newInputs = { ...inputs, [field]: clampedValue };
    setInputs(newInputs);
    
    if (clampedValue && !isNaN(clampedValue)) {
      setNumbers(prev => ({
        ...prev,
        [updateField]: parseInt(clampedValue)
      }));
    }
  };

  const handleNewExample = () => {
    const newNumbers = generateNumbers();
    setNumbers(newNumbers);
    setInputs({
      numerator: newNumbers.num.toString(),
      denominator: newNumbers.den.toString(),
      power: newNumbers.power.toString()
    });
    setStep1Complete(false);
    setStep2Complete(false);
    setShowAnswer(false);
    setHasError({
      numerator: false,
      denominator: false,
      numeratorResult: false,
      denominatorResult: false
    });
    setStep1Inputs({
      numeratorPower: '',
      denominatorPower: ''
    });
    setStep2Inputs({
      numeratorResult: '',
      denominatorResult: ''
    });
  };

  const handleStep1Check = () => {
    const numPower = parseInt(step1Inputs.numeratorPower);
    const denPower = parseInt(step1Inputs.denominatorPower);
    
    const isNumeratorCorrect = !isNaN(numPower) && numPower === solutionNumbers.power;
    const isDenominatorCorrect = !isNaN(denPower) && denPower === solutionNumbers.power;
    
    setHasError(prev => ({
      ...prev,
      numerator: !isNumeratorCorrect,
      denominator: !isDenominatorCorrect
    }));

    if (isNumeratorCorrect && isDenominatorCorrect) {
      setStep1Complete(true);
    }
  };

  const handleStep2Check = () => {
    const numResult = parseInt(step2Inputs.numeratorResult);
    const denResult = parseInt(step2Inputs.denominatorResult);
    
    const correctNumerator = Math.pow(solutionNumbers.num, solutionNumbers.power);
    const correctDenominator = Math.pow(solutionNumbers.den, solutionNumbers.power);
    
    const isNumeratorCorrect = !isNaN(numResult) && numResult === correctNumerator;
    const isDenominatorCorrect = !isNaN(denResult) && denResult === correctDenominator;
    
    setHasError(prev => ({
      ...prev,
      numeratorResult: !isNumeratorCorrect,
      denominatorResult: !isDenominatorCorrect
    }));

    if (isNumeratorCorrect && isDenominatorCorrect) {
      setStep2Complete(true);
    }
  };

  return (
    <div className="bg-gray-100 p-8 w-[780px] overflow-auto">
      <Card className="w-[748px] mx-auto shadow-md bg-white">
        <div className="bg-sky-50 p-6 rounded-t-lg w-[748px]">
          <h1 className="text-sky-900 text-2xl font-bold">Power of Quotients Property</h1>
          <p className="text-sky-800">Practice raising fractions to powers!</p>
        </div>

        <CardContent className="space-y-6 pt-6 w-[748px]">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-2">Understanding Powers of Fractions</h2>
            <p className="text-blue-600 mb-2">
              When raising a fraction to a power, the power applies to both the numerator and denominator separately.
            </p>
            <div className="p-4 text-center text-xl flex items-center justify-center gap-3">
              <PowerFraction numerator="a" denominator="b" power="n" />
              <span>=</span>
              <Fraction 
                numerator={<span>a<sup>n</sup></span>}
                denominator={<span>b<sup>n</sup></span>}
              />
            </div>
            <p className="text-blue-600 mt-4">
              Practice simplifying powers using this property!
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-700 text-lg font-bold">Choose your numbers:</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="numerator">Numerator</Label>
                <Input
                  id="numerator"
                  type="number"
                  min="2"
                  max="4"
                  value={inputs.numerator}
                  onChange={(e) => handleInputChange('numerator', e.target.value)}
                  className="border border-blue-300 rounded mt-1"
                />
              </div>
              <div>
                <Label htmlFor="denominator">Denominator</Label>
                <Input
                  id="denominator"
                  type="number"
                  min="1"
                  max="10"
                  value={inputs.denominator}
                  onChange={(e) => handleInputChange('denominator', e.target.value)}
                  className="border border-blue-300 rounded mt-1"
                />
              </div>
              <div>
                <Label htmlFor="power">Power</Label>
                <Input
                  id="power"
                  type="number"
                  min="1"
                  max="3"
                  value={inputs.power}
                  onChange={(e) => handleInputChange('power', e.target.value)}
                  className="border border-blue-300 rounded mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <Button 
                onClick={handleNewExample}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Random
              </Button>
            </div>

            <div className="text-center text-2xl flex items-center justify-center h-32">
              <div className="-mt-5">
                <PowerFraction 
                  numerator={numbers.num}
                  denominator={numbers.den}
                  power={numbers.power}
                />
              </div>
            </div>
            
            <Button 
              onClick={() => {
                setSolutionNumbers(numbers);
                setStep1Complete(false);
                setStep2Complete(false);
                setStep1Inputs({
                  numeratorPower: '',
                  denominatorPower: ''
                });
                setStep2Inputs({
                  numeratorResult: '',
                  denominatorResult: ''
                });
                setShowAnswer(false);
                setHasError({
                  numerator: false,
                  denominator: false,
                  numeratorResult: false,
                  denominatorResult: false
                });
                setTimeout(() => setShowAnswer(true), 0);
              }}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3"
            >
              Solve Step by Step
            </Button>

            {showAnswer && (
              <div className="space-y-4">
                <h3 className="text-purple-600 text-xl font-bold">Solution Steps:</h3>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p>1. Apply the power to both numerator and denominator:</p>
                  <div className="text-center text-xl flex items-center justify-center gap-3 py-10">
                    <PowerFraction 
                      numerator={solutionNumbers.num}
                      denominator={solutionNumbers.den}
                      power={solutionNumbers.power}
                    />
                    <span>=</span>
                    {step1Complete ? (
                      <Fraction 
                        numerator={<span>{solutionNumbers.num}<sup>{solutionNumbers.power}</sup></span>}
                        denominator={<span>{solutionNumbers.den}<sup>{solutionNumbers.power}</sup></span>}
                      />
                    ) : (
                      <Fraction inputMode={true}
                        numerator={
                          <div className="inline-flex items-start">
                            <span>{solutionNumbers.num}</span>
                            <Input 
                              type="number"
                              value={step1Inputs.numeratorPower}
                              onChange={(e) => {
                                const value = Math.min(parseInt(e.target.value) || '', 12);
                                setStep1Inputs(prev => ({
                                  ...prev,
                                  numeratorPower: value
                                }));
                                setHasError(prev => ({...prev, numerator: false}));
                              }}
                              className={`w-8 h-6 -mt-6 ml-1 p-0 text-center text-sm ${
                                hasError.numerator ? 'border-red-500 focus:border-red-500' : 'border-blue-300'
                              }`}
                              min="1"
                              max="12"
                            />
                          </div>
                        }
                        denominator={
                          <div className="inline-flex items-start">
                            <span>{solutionNumbers.den}</span>
                            <Input 
                              type="number"
                              value={step1Inputs.denominatorPower}
                              onChange={(e) => {
                                const value = Math.min(parseInt(e.target.value) || '', 12);
                                setStep1Inputs(prev => ({
                                  ...prev,
                                  denominatorPower: value
                                }));
                                setHasError(prev => ({...prev, denominator: false}));
                              }}
                              className={`w-8 h-8 -mt-4 ml-1 p-0 text-center ${
                                hasError.denominator ? 'border-red-500 focus:border-red-500' : 'border-blue-300'
                              }`}
                              min="1"
                              max="12"
                            />
                          </div>
                        }
                      />
                    )}
                  </div>
                  
                  {!step1Complete && (
                    <div className="flex gap-4 mt-4">
                      <Button
                        onClick={handleStep1Check}
                        className="bg-blue-400 hover:bg-blue-500 flex-1"
                      >
                        Check
                      </Button>
                      <Button
                        onClick={() => setStep1Complete(true)}
                        className="bg-gray-400 hover:bg-gray-500 text-white flex-1"
                      >
                        Skip
                      </Button>
                    </div>
                  )}

                  {step1Complete && (
                    <>
                      <p>2. Calculate the powers:</p>
                      <div className="text-center text-xl flex items-center justify-center gap-3">
                        <Fraction 
                          numerator={<span>{solutionNumbers.num}<sup>{solutionNumbers.power}</sup></span>}
                          denominator={<span>{solutionNumbers.den}<sup>{solutionNumbers.power}</sup></span>}
                        />
                        <span>=</span>
                        {step2Complete ? (
                          <Fraction 
                            numerator={Math.pow(solutionNumbers.num, solutionNumbers.power)}
                            denominator={Math.pow(solutionNumbers.den, solutionNumbers.power)}
                          />
                        ) : (
                          <div className="inline-flex flex-col items-center gap-2">
                            <div className="w-24 flex justify-center">
                              <Input 
                                type="number"
                                value={step2Inputs.numeratorResult}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setStep2Inputs(prev => ({
                                    ...prev,
                                    numeratorResult: value
                                  }));
                                  setHasError(prev => ({...prev, numeratorResult: false}));
                                }}
                                className={`w-12 h-6 text-center border-2 ${
                                  hasError.numeratorResult ? 'border-red-500 focus:border-red-500' : 'border-blue-300'
                                }`}
                              />
                            </div>
                            <div className="w-24 border-t-2 border-black"></div>
                            <div className="w-24 flex justify-center">
                              <Input 
                                type="number"
                                value={step2Inputs.denominatorResult}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setStep2Inputs(prev => ({
                                    ...prev,
                                    denominatorResult: value
                                  }));
                                  setHasError(prev => ({...prev, denominatorResult: false}));
                                }}
                                className={`w-12 h-6 text-center border-2 ${
                                  hasError.denominatorResult ? 'border-red-500 focus:border-red-500' : 'border-blue-300'
                                }`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {!step2Complete && (
                        <div className="flex gap-4 mt-4">
                          <Button
                            onClick={handleStep2Check}
                            className="bg-blue-400 hover:bg-blue-500 flex-1"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={() => setStep2Complete(true)}
                            className="bg-gray-400 hover:bg-gray-500 text-white flex-1"
                          >
                            Skip
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {step2Complete && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-green-800 text-xl font-bold">Great Work!</h3>
                    <p className="text-green-700">
                      You've successfully solved the power of quotients problem!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-gray-600 mt-4">
        Understanding powers of fractions is essential for algebra and higher mathematics!
      </p>
    </div>
  );
};

export default QuotientPowerProperty;