import { Text, View } from '_context/Themed';
import { Pressable } from 'react-native';
import { useUserLocation } from 'src/hooks/useUserLocation';
import { useForecast } from 'src/store/forecastStore/forecast.store';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useEffect } from 'react';
import Toast from 'react-native-root-toast';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

export const ForecastHeader = () => {
  const { location, error } = useUserLocation();
  const fetchForecast = useForecast((c) => c.fetchForecast);
  const weather = useForecast((c) => c.weather);

  const { t } = useTranslation();

  const rotate = useSharedValue('0deg');

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: rotate.value }],
  }));

  const onReset = async () => {
    if (!location || error) {
      return;
    }
    await fetchForecast({
      latitude: location.coords.latitude,
      longitude: location.coords.latitude,
    });

    const newRotateValue = `${Number(rotate.value.split('deg')[0]) + 360}deg`;

    rotate.value = withTiming(newRotateValue, {
      duration: 1000,
      easing: Easing.linear,
    });
    Toast.show(t('refreshed'));
  };

  useEffect(() => {
    if (weather || !location || error) {
      return;
    }
    fetchForecast({
      latitude: location.coords.latitude,
      longitude: location.coords.latitude,
    });
  }, [location, error, weather]);

  return (
    <View>
      {weather && (
        <View className="w-screen px-8">
          <View className="flex-row p-4 shadow-md justify-between items-center bg-transparent dark:bg-black bg-white">
            <View className="items-center flex-row gap-4">
              <View className="items-center gap-1 flex-row bg-transparent">
                <Ionicons name="thermometer-outline" size={24} />
                <Text className="text-xl">
                  {weather.current_weather.temperature}
                </Text>
              </View>
              <View className="items-center gap-1 flex-row bg-transparent">
                <FontAwesome5 name="wind" size={24} color="black" />
                <Text className="text-xl">
                  {weather.current_weather.windspeed}
                </Text>
              </View>
            </View>
            <Pressable onPress={onReset}>
              <AnimatedIonicons name="refresh" size={24} style={style} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};
