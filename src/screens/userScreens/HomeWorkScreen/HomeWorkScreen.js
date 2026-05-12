import { StyleSheet } from 'react-native'
import React from 'react'
import { useThemeStore } from '../../../store/useThemeStore';
import ScrollableScreen from './ScreensComponent/ScrollableScreen'
import DefaultScreen from './ScreensComponent/DefaultScreen'

const HomeWorkScreen = () => {
    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();

    return (
        <>
            {/* {theme?.component?.home_work_component_name == "addHomeWorkComponent" ?
                <DefaultScreen />
                : */}
                <ScrollableScreen />
            {/* } */}
        </>
    )
}

export default HomeWorkScreen

const styles = StyleSheet.create({})