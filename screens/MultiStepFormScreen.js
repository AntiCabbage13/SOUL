/* import React, { useState } from 'react';
import { View } from 'react-native';
import AnimatedMultistep from 'react-native-animated-multistep';
import StepNameSurname from './StepNameSurname';
import StepDOBGender from './StepDOBGender';
import StepWeightHeight from './StepWeightHeight';
import CollectedData from './collectedData';

const MultiStepFormScreen = () => {
  const allSteps = [
    { name: 'Name & Surname', component: StepNameSurname },
    { name: 'Date of Birth & Gender', component: StepDOBGender },
    { name: 'Weight, Height & Head Circumference', component: StepWeightHeight },
    { name: 'Collected Data', component: CollectedData },
  ];

  const [stepData, setStepData] = useState({}); // State to hold step data

  const handleStepData = (stepName, data) => {
    // Callback function to receive step data
    setStepData(prevData => ({ ...prevData, [stepName]: data }));
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedMultistep
        steps={allSteps}
        onNext={(nextStep, stepData) => {
          // Check if nextStep is defined before accessing its properties
          if (nextStep) {
            handleStepData(nextStep.name, stepData);
          }
        }}
        onBack={() => {}}
        finish={finalState => {
          console.log(finalState);
          console.log('Step Data:', stepData);
        }}
        duration={30}
        comeInOnNext="bounceInUp"
        OutOnNext="bounceOutDown"
        comeInOnBack="bounceInDown"
        OutOnBack="bounceOutUp"
      />
    </View>
  );
};

export default MultiStepFormScreen;
 */
import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import AnimatedMultistep from 'react-native-animated-multistep';
import StepNameSurname from './StepNameSurname';
import StepDOBGender from './StepDOBGender';
import StepWeightHeight from './StepWeightHeight';
import CollectedData from './collectedData';

const MultiStepFormScreen = () => {
  const allSteps = [
    { name: 'Name & Surname', component: StepNameSurname },
    { name: 'Date of Birth & Gender', component: StepDOBGender },
    { name: 'Weight, Height & Head Circumference', component: StepWeightHeight },
    { name: 'Collected Data', component: CollectedData },
  ];

  // Define a ref to hold the step data state
  const stepDataRef = useRef({});

  const handleStepData = (stepName, data) => {
    // Callback function to receive step data and store it in the ref
    stepDataRef.current[stepName] = data;
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedMultistep
        steps={allSteps}
        onNext={(nextStep, stepData) => {
          // Check if nextStep is defined before accessing its properties
          if (nextStep) {
            handleStepData(nextStep.name, stepData);
          }
        }}
        onBack={() => {}}
        finish={finalState => {
          console.log(finalState);
          console.log('Step Data:', stepDataRef.current);
        }}
        duration={30}
        comeInOnNext="bounceInUp"
        OutOnNext="bounceOutDown"
        comeInOnBack="bounceInDown"
        OutOnBack="bounceOutUp"
      />
    </View>
  );
};

export default MultiStepFormScreen;
