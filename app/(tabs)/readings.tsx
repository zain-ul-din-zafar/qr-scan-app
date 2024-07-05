import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, StatusBar, Modal } from "react-native";
import { Text, Card, Button, Datepicker } from "@ui-kitten/components";
import { useLocalSearchParams } from "expo-router";
import useReadings, { Reading } from "@/hooks/useReadings";
import moment from "moment";
import ImageViewer from "react-native-image-zoom-viewer";

export default function ReadingsScreen() {
  const { id, name } = useLocalSearchParams() as any as {
    id: string;
    name: string;
  };
  const { readings } = useReadings();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filteredReadings, setFilteredReadings] = useState<Reading[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const dateStr = moment(selectedDate).format("YYYY-MM-DD");
    const filtered = readings.filter(
      (reading) =>
        reading.uid === id &&
        moment(reading.created_at).format("YYYY-MM-DD") === dateStr
    );
    setFilteredReadings(filtered);
  }, [selectedDate, readings]);

  const handleDateChange = (nextDate: Date) => {
    setSelectedDate(nextDate);
  };

  const handleImageView = (imageUri: string) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text category="h3" style={styles.headerText}>
        Readings for {name}
      </Text>
      <Text category="h6" style={styles.dateLabel}>
        Filter by Date:
      </Text>
      <Datepicker
        date={selectedDate}
        onSelect={handleDateChange}
        style={styles.datePicker}
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {filteredReadings.length > 0 ? (
          filteredReadings.map((reading) => (
            <Card key={reading.created_at.toString()} style={styles.card}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text category="s1" style={styles.tableCell}>
                    Inlet Pressure:
                  </Text>
                  <Text category="s1" style={styles.tableCell}>
                    {reading.inletPressure}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text category="s1" style={styles.tableCell}>
                    Outlet Pressure:
                  </Text>
                  <Text category="s1" style={styles.tableCell}>
                    {reading.outletPressure}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text category="s1" style={styles.tableCell}>
                    Diff Pressure Indication:
                  </Text>
                  <Text category="s1" style={styles.tableCell}>
                    {reading.diffPressureIndication}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text category="s1" style={styles.tableCell}>
                    Date:
                  </Text>
                  <Text category="s1" style={styles.tableCell}>
                    {moment(reading.created_at).format(
                      "dddd, MMMM Do YYYY, HH:mm"
                    )}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text category="s1" style={styles.tableCell}>
                    Oil Level Image:
                  </Text>
                  <Button
                    onPress={() => handleImageView(reading.oilLevel)}
                    style={styles.imageButton}
                    size="tiny"
                  >
                    View Image
                  </Button>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <Text category="h6" style={styles.noReadingsText}>
            No readings available for the selected date.
          </Text>
        )}
      </ScrollView>
      {selectedImage && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <ImageViewer
            imageUrls={[{ url: selectedImage }]}
            enableSwipeDown
            onSwipeDown={() => setModalVisible(false)}
            renderHeader={() => (
              <View style={styles.modalHeader}>
                <Button
                  appearance="ghost"
                  status="control"
                  onPress={() => setModalVisible(false)}
                >
                  Close
                </Button>
              </View>
            )}
          />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    padding: 6,
    flex: 1,
    backgroundColor: "white"
  },
  headerText: {
    textAlign: "center",
    marginBottom: 16
  },
  dateLabel: {
    marginBottom: 8
  },
  datePicker: {
    marginBottom: 16
  },
  scrollView: {
    paddingBottom: 16
  },
  card: {
    marginBottom: 16
  },
  table: {
    flexDirection: "column"
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4
  },
  tableCell: {
    flex: 1
  },
  imageButton: {
    alignSelf: "flex-start"
  },
  noReadingsText: {
    textAlign: "center",
    marginTop: 32
  },
  modalHeader: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    alignItems: "flex-end",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
});
