import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

function FloatingOrb({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  const opacity = useSharedValue(0.15);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.4, { duration: 2000 + delay }),
          withTiming(0.1, { duration: 2000 + delay }),
        ),
        -1,
        false,
      ),
    );
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-20, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        style,
        { left: x, top: y, width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const glowScale = useSharedValue(1);

  useEffect(() => {
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/setup');
  };

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0E0606', '#1A0808', '#0E0606']}
        style={StyleSheet.absoluteFillObject}
      />

      <FloatingOrb delay={0} x={-40} y={height * 0.1} size={200} />
      <FloatingOrb delay={800} x={width * 0.6} y={height * 0.05} size={150} />
      <FloatingOrb delay={400} x={width * 0.2} y={height * 0.7} size={180} />
      <FloatingOrb delay={1200} x={width * 0.7} y={height * 0.6} size={120} />

      <View style={[styles.content, { paddingTop: topPadding + 20, paddingBottom: bottomPadding + 20 }]}>
        <Animated.View entering={FadeInDown.duration(800).delay(200)} style={styles.headerContainer}>
          <Animated.View style={[styles.glowContainer, glowStyle]}>
            <View style={styles.iconBg}>
              <Text style={styles.iconText}>☩</Text>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeInDown.duration(600).delay(400)} style={styles.title}>
            Falso Profeta
          </Animated.Text>
          <Animated.Text entering={FadeInDown.duration(600).delay(600)} style={styles.subtitle}>
            El impostor bíblico
          </Animated.Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(800).delay(800)} style={styles.descriptionCard}>
          <View style={styles.decorLine} />
          <Text style={styles.descriptionText}>
            Un profeta falso se ha infiltrado entre los siervos de Dios.
            Los creyentes conocen la Palabra... pero el impostor solo tiene una pista.
          </Text>
          <View style={styles.decorLine} />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(1000)} style={styles.rulesContainer}>
          <RuleItem icon="✦" text="Todos reciben un personaje bíblico" />
          <RuleItem icon="⚔" text="El Falso Profeta solo tiene una pista" />
          <RuleItem icon="†" text="Discutan y eliminen sospechosos" />
          <RuleItem icon="☩" text="Si queda 1 civil, el impostor gana" />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(1200)} style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
            onPress={handleStart}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDim]}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.startButtonText}>Comenzar Partida</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

function RuleItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.ruleItem}>
      <Text style={styles.ruleIcon}>{icon}</Text>
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  orb: {
    position: 'absolute',
    backgroundColor: Colors.accent,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    gap: 20,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 12,
  },
  glowContainer: {
    alignItems: 'center',
  },
  iconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  iconText: {
    fontSize: 44,
    color: Colors.primary,
  },
  title: {
    fontSize: 38,
    fontFamily: 'Inter_700Bold',
    color: Colors.gold,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  descriptionCard: {
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 8,
  },
  decorLine: {
    width: 80,
    height: 1,
    backgroundColor: Colors.goldDim,
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  rulesContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  ruleIcon: {
    fontSize: 16,
    color: Colors.gold,
    width: 20,
    textAlign: 'center',
  },
  ruleText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: 8,
  },
  startButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  startButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    letterSpacing: 0.5,
  },
});
