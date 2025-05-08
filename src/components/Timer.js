import React, { useState, useEffect, useRef } from 'react';
import { Text } from 'react-native';
import { Colors, Fonts, Sizes } from '../constants/styles';

const Timer = React.memo(({ startTimer ,setTimerStarted}) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!startTimer) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          setTimerStarted(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [startTimer]);

  return (
    <Text
      style={{
        ...Fonts.grayColor18SemiBold,
        color: Colors.primaryColor,
        textAlign: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
      }}
    >
      Resend in {timeLeft}s
    </Text>
  );
});

export default Timer;
