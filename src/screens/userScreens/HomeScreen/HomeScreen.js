import React from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import HomeCard from '../../../components/HomeCard';
import MainBox from '../../../components/MainBox';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import globalStyles from '../../../themes/globalStyles';
import CustomStatusBar from '../../../components/CustomStatusBar';
import Orientation from 'react-native-orientation-locker';
import { useScreenNavigationStore } from '../../../store/useScreenNavigationStore';
import { useThemeStore } from '../../../store/useThemeStore';
import { attendance, checkInOut, homework } from '../../../assets';
import { scale } from '../../../themes/sizes';
import { useTabStore } from '../../../store/useTabStore';
import themes from '../../../themes/colors';




export default function HomeScreen() {
  // Retrieve current app theme from Zustand global store
  const { theme } = useThemeStore();

  const menuItems = [
    { id: 1, title: theme?.task?.name || "Homework", bg: "#7B68EE", url: "CampusShiftScreen", type: "homework", image: homework },
    { id: 3, title: "Attendance", bg: "#3B5998", url: "CampusShiftScreen", type: "attendance", image: attendance },
    { id: 4, title: "Check In / Out", bg: "#3B5998", url: "CheckInOutScreen", type: "upcoming", image: checkInOut },
  ];

  const navigation = useNavigation()
  const { setNavigationData } = useScreenNavigationStore();
  const { setActiveTab, setLastHomeScreen, setLastFeeScreen, setLastTopBarScreen } = useTabStore();

  // Dynamic screen width 
  const { width } = useWindowDimensions();
  // 2. Grid Logic
  const numColumns = 3;

  // This function adds "empty" objects to fill the last row so items stay aligned left
  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);

    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ id: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  const allowedTypes = ["homework", "attendance"];

  // const handleUserPress = (item) => {
  //   setLastTopBarScreen(null)
  //   setNavigationData(item?.type, item);
  //   setLastHomeScreen(item.url);
  //   setActiveTab('HomeStack');

  //   navigation.navigate('HomeStack', {
  //     screen: item.url,
  //   });
  // };

  const handleUserPress = (item) => {
    setLastTopBarScreen(null);
    if (allowedTypes.includes(item?.type)) {
      setNavigationData(item?.type, item);
    }else{
      setNavigationData(null, item);
    }
    setLastHomeScreen(item.url);
    setActiveTab('HomeStack');

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HomeStack',
          state: {
            index: 0,
            routes: [
              { name: item.url },
            ],
          },
        },
      ],
    });
  };


  const renderItem = ({ item }) => {
    // If it's a spacer, render an invisible view to maintain the grid structure
    if (item.empty) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }

    return (
      <View style={styles.item}>
        <HomeCard
          title={item.title}
          cardBgColor={item.bg}
          onPress={() => handleUserPress(item)}
          titleSize={theme?.text_font_size?.medium_small}
          image={item?.image}
        />
      </View>
    );
  };
  return (
    <>
      {/* <OrientationLocker orientation={PORTRAIT} /> */}

      <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" translucent={true} />
      <View style={{ flex: 1 }}>
        <CustomHeader
          title="Dashboard"
          isMenu={true}
          onLeftPress={() => navigation.openDrawer()}
          titleSize={theme?.heading_font_size?.h4}
          containerStyle={{ backgroundColor: theme?.theme?.primary }}
        />

        <View style={styles.container}>
          <MainBox paddingVertical={0} height={'100%'} disableScroll={true}>
            <FlatList
              data={formatData([...menuItems], numColumns)}
              key={numColumns} // Forces refresh when columns change
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={numColumns}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </MainBox>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
    paddingVertical: globalStyles?.mainBoxWrapper?.paddingVertical,
    backgroundColor: themes?.off_white,
  },
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: scale(0), // Slight padding for the whole list
  },
  item: {
    flex: 1, // This is the key: every item (including spacers) takes equal width
    margin: 6, // Uniform gap between cards
    height: scale(110), // Adjust height as per your card design
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
});
