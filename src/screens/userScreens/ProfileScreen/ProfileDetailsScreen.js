import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, FlatList } from "react-native";
import CustomHeader from "../../../components/CustomHeader";
import AppText from "../../../components/AppText";
import ProfileSkeleton from "../../../components/Skeletons/ProfileSkeleton";
import themes from "../../../themes/colors";
import { moderateScale, scale, verticalScale } from "../../../themes/sizes";
import { useNavigation } from "@react-navigation/native";
import CustomStatusBar from "../../../components/CustomStatusBar";
import { useThemeStore } from "../../../store/useThemeStore";
import { useUserStore } from '../../../store/useUserStore';
import { useAuthStore } from "../../../store/useAuthStore";
import NoDataFound from "../../../components/NoDataFound";
import MainBox from "../../../components/MainBox";
import globalStyles from "../../../themes/globalStyles";
import { useApiRoutesStore } from "../../../store/useApiRoutesStore";
import { user_avatar } from "../../../assets";




/* ---------- Row UI ---------- */
const Field = ({ label, value, last, theme }) => (
  <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
    <AppText style={{ fontSize: moderateScale(theme?.text_font_size?.medium) }} color={theme?.theme?.medium_text}>{label}</AppText>
    <AppText weight="Medium" style={{ fontSize: moderateScale(theme?.text_font_size?.medium) }} color={theme?.theme?.dark_text}>{value || "-"}</AppText>
  </View>
);


export default function ProfileDetailsScreen() {
  const navigation = useNavigation();

  // Retrieve current app theme from Zustand global store
  const { theme } = useThemeStore();

  const { getProfile, profile, loading } = useUserStore()
  const { user } = useAuthStore();

  // global routes 
  const { routes } = useApiRoutesStore.getState();

  // This state is used to control the pull-to-refresh loading indicator on the screen
  const [refreshing, setRefreshing] = useState(false);




  /* ---------- Pull Refresh ---------- */
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await getProfile(routes?.get_employee_details);
    } catch (error) {
      console.log(error);
    }

    setRefreshing(false);
  };


  /* ---------- Initial Load ---------- */
  useEffect(() => {
    // Only fetch if parentDetails is empty
    if (!profile || profile.length === 0) {
      const fetchData = async () => {
        await getProfile(routes?.get_employee_details);
      };

      fetchData();
    }
  }, [profile]);

  return (
    <>
      {/* <OrientationLocker orientation={PORTRAIT} /> */}
      <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" translucent={true} />


      <View style={{ flex: 1, backgroundColor: themes.white }}>
        {/* Header */}
        <CustomHeader
          title="Profile Details"
          titleSize={theme?.heading_font_size?.h4} containerStyle={{ backgroundColor: theme?.theme?.primary }}
          isBack={true}
          onBackPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.navigate("DrawerNavigator");
          }}
        />

        {/* Purple Top */}
        <View style={[styles.topWrapper, { backgroundColor: theme?.theme?.primary }]} />

        {/* Fixed Profile Card */}
        <View style={styles.profileCard}>
          <Image
            //  source={{ uri: 'https://i.pravatar.cc/300' }}
            source={user_avatar}
            style={styles?.avatar} />
          <View>
            <AppText weight="Bold" style={{ textTransform: 'capitalize', fontSize: moderateScale(theme?.text_font_size?.large) }} color={theme?.theme?.dark_Text}>
              {user?.f_name} {user?.l_name}
            </AppText>
            <AppText style={[styles.email, { fontSize: moderateScale(theme?.text_font_size?.medium) }]} color={theme?.theme?.medium_text}>{user?.email}</AppText>
          </View>
        </View>

        {/*Employee Profile Details */}
        {loading ? <ProfileSkeleton /> :
          <View style={styles.container}>
            <MainBox paddingVertical={verticalScale(4)} paddingHorizontal={0} height={'100%'} disableScroll>
              <FlatList
                data={profile}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: verticalScale(20), paddingHorizontal: scale(14), }}
                renderItem={({ item }) => (
                  <Field
                    label={item.label}
                    value={item.value || "-"}
                    theme={theme}
                  />
                )}
                ListEmptyComponent={<NoDataFound />}
              />
            </MainBox>
          </View>
        }
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topWrapper: {
    height: moderateScale(50),
  },
  container: {
    flex: 1,
    paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
    paddingVertical: globalStyles?.mainBoxWrapper?.paddingVertical,
    backgroundColor: themes.white,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: themes.white,
    borderRadius: moderateScale(14),
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(8),
    marginTop: -moderateScale(46),
    marginHorizontal: moderateScale(10),
    marginBottom: moderateScale(4),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  avatar: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    marginRight: moderateScale(12),
  },

  email: {
    marginTop: moderateScale(4),
  },

  /* Details List */
  detailsCard: {
    flex: 1,
    backgroundColor: themes.white,
    borderRadius: moderateScale(14),
    marginHorizontal: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },


});
