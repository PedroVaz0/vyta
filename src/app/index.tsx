import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
};

const SPLASH_DURATION = 2000; // tempo que a splash fica visível, em ms
const FADE_DURATION = 500; // duração da transição suave, em ms

export default function IndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showSplash, setShowSplash] = useState(true);

  const splashOpacity = useRef(new Animated.Value(1)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      // Faz a splash sumir e a tela de boas-vindas aparecer ao mesmo tempo.
      Animated.parallel([
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(welcomeOpacity, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => setShowSplash(false));
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const goToLogin = (role: 'medico' | 'paciente') => {
    router.push({ pathname: '/login', params: { role } });
  };

  return (
    <View style={styles.container}>
      {/* Tela de boas-vindas (fica embaixo, vai aparecendo com o fade) */}
      <Animated.View
        style={[styles.fullScreen, { opacity: welcomeOpacity }]}
        pointerEvents={showSplash ? 'none' : 'auto'}
      >
        <View style={[styles.top, { paddingTop: insets.top }]}>
          <Image
            source={require('../components/VytaLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brand}>vyta</Text>
          <Text style={styles.slogan}>saúde que te acompanha</Text>
        </View>

        <View style={[styles.bottomCard, { paddingBottom: 56 + insets.bottom }]}>
          <Text style={styles.welcomeTitle}>Bem vindo</Text>
          <Text style={styles.welcomeSubtitle}>
            Escolha seu perfil para continuar
          </Text>

          <View style={styles.buttonsRow}>
            <Pressable
              style={[styles.button, styles.buttonOrange]}
              onPress={() => goToLogin('medico')}
            >
              <Text style={styles.buttonTextWhite}>Médico</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonWhite]}
              onPress={() => goToLogin('paciente')}
            >
              <Text style={styles.buttonTextOrange}>Paciente</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>

      {/* Splash (fica por cima, some com o fade) */}
      {showSplash && (
        <Animated.View
          style={[styles.fullScreen, styles.splash, { opacity: splashOpacity }]}
          pointerEvents="none"
        >
          <Svg
            height={height}
            width={width}
            viewBox={`0 0 ${width} ${height}`}
            style={StyleSheet.absoluteFill}
          >
            <Path
              d={`
                M ${width} 0
                L ${width} ${height}
                L 0 ${height}
                C ${width * 0.15} ${height * 0.78},
                  ${width * 0.75} ${height * 0.62},
                  ${width * 0.55} ${height * 0.32}
                C ${width * 0.4} ${height * 0.14},
                  ${width * 0.65} ${height * 0.04},
                  ${width * 0.8} 0
                Z
              `}
              fill={COLORS.teal}
            />
          </Svg>

          <View style={styles.splashContent}>
            <Image
              source={require('../components/VytaLogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brand}>vyta</Text>
            <Text style={styles.slogan}>saúde que te acompanha</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  splash: {
    backgroundColor: COLORS.white,
  },
  splashContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  brand: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.orange,
  },
  slogan: {
    fontSize: 13,
    color: '#333333',
    marginTop: 2,
  },
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCard: {
    backgroundColor: COLORS.teal,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 28,
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  buttonOrange: {
    backgroundColor: COLORS.orange,
  },
  buttonWhite: {
    backgroundColor: COLORS.white,
  },
  buttonTextWhite: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
  buttonTextOrange: {
    color: COLORS.orange,
    fontWeight: '700',
    fontSize: 15,
  },
});