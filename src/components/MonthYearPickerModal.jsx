import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useThemeStore } from '../store/useThemeStore';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();
const MIN_YEAR = 1990;

const MonthYearPickerModal = ({
  visible,
  onClose,
  onConfirm,
  value,
}) => {

  const { theme } = useThemeStore();

  const [selectedMonth, setSelectedMonth] = useState(
    value ? new Date(value).getMonth() : CURRENT_MONTH
  );

  const [selectedYear, setSelectedYear] = useState(
    value ? new Date(value).getFullYear() : CURRENT_YEAR
  );

  // ✅ Sync when modal opens
  useEffect(() => {
    if (visible && value) {
      const date = new Date(value);
      setSelectedMonth(date.getMonth());
      setSelectedYear(date.getFullYear());
    }
  }, [visible, value]);

  const changeYear = (type) => {
    setSelectedYear((prevYear) => {
      let newYear = prevYear;

      if (type === 'inc' && prevYear < CURRENT_YEAR) {
        newYear = prevYear + 1;
      } else if (type === 'dec' && prevYear > MIN_YEAR) {
        newYear = prevYear - 1;
      }

      // 🔥 FIX: if switching to current year, adjust month
      if (newYear === CURRENT_YEAR && selectedMonth > CURRENT_MONTH) {
        setSelectedMonth(CURRENT_MONTH);
      }

      return newYear;
    });
  };

  const handleConfirm = () => {
    const date = new Date(selectedYear, selectedMonth, 1);
    onConfirm?.(date);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>

        <View style={styles.modalBox}>

          {/* YEAR HEADER */}
          <View style={styles.yearRow}>
            <TouchableOpacity onPress={() => changeYear('dec')}>
              <Text style={styles.arrow}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.yearText}>{selectedYear}</Text>

            <TouchableOpacity
              onPress={() => changeYear('inc')}
              disabled={selectedYear >= CURRENT_YEAR}
            >
              <Text style={[
                styles.arrow,
                selectedYear >= CURRENT_YEAR && { opacity: 0.3 }
              ]}>
                ›
              </Text>
            </TouchableOpacity>
          </View>

          {/* MONTH GRID */}
          <View style={styles.monthGrid}>
            {MONTHS.map((m, i) => {
              const isFutureMonth =
                selectedYear === CURRENT_YEAR && i > CURRENT_MONTH;

              return (
                <TouchableOpacity
                  key={i}
                  disabled={isFutureMonth}
                  onPress={() => setSelectedMonth(i)}
                  style={[
                    styles.monthItem,
                    selectedMonth === i && styles.activeMonth,
                    isFutureMonth && styles.disabledMonth
                  ]}
                >
                  <Text
                    style={
                      isFutureMonth
                        ? styles.disabledText
                        : selectedMonth === i
                          ? styles.activeText
                          : styles.text
                    }
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* BUTTONS */}
          <View style={styles.btnRow}>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.btn, { backgroundColor: '#ddd' }]}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              style={[styles.btn, { backgroundColor: theme?.theme?.primary }]}
            >
              <Text style={{ color: '#fff' }}>Confirm</Text>
            </TouchableOpacity>

          </View>

        </View>

      </View>
    </Modal>
  );
};

export default MonthYearPickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000070',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },

  yearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  arrow: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },

  yearText: {
    fontSize: 18,
    fontWeight: '700',
  },

  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  monthItem: {
    width: '33%',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 5,
  },

  activeMonth: {
    backgroundColor: '#dbeafe',
  },

  disabledMonth: {
    opacity: 0.3,
  },

  text: {
    color: '#333',
  },

  activeText: {
    color: '#1d4ed8',
    fontWeight: '700',
  },

  disabledText: {
    color: '#aaa',
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});