import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  ViewComponent
} from "react-native";
import { Text, Button, Datepicker } from "@ui-kitten/components";
import { useLocalSearchParams } from "expo-router";
import useReadings, { Reading } from "@/hooks/useReadings";
import { useComposeEquipments } from "@/hooks/useComposeEquipments";
import moment from "moment";
import ImageViewer from "react-native-image-zoom-viewer";
import * as Print from "expo-print";

export default function ReadingsScreen() {
  const { id } = useLocalSearchParams() as any as { id: string };
  const { readings } = useReadings();
  const allEquipments = useComposeEquipments();
  const groupEquipments = allEquipments[id as keyof typeof allEquipments];

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filteredReadings, setFilteredReadings] = useState<Reading[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const tableRef = useRef<any>(null);

  useEffect(() => {
    const dateStr = moment(selectedDate).format("YYYY-MM-DD");
    const filtered = readings.filter(
      (reading) =>
        groupEquipments.some((equipment) => equipment.id === reading.uid) &&
        moment(reading.created_at).format("YYYY-MM-DD") === dateStr
    );
    setFilteredReadings(filtered);
  }, [selectedDate, readings, groupEquipments]);

  const handleDateChange = (nextDate: Date) => {
    setSelectedDate(nextDate);
  };

  const handleImageView = (imageUri: string) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const handlePrint = async () => {
    if (tableRef.current) {
      const printData = `
        <html>
          <head>
            <style>
              body {
                width: 100%;
                height: 100%;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: center;
              }
              th {
                background-color: #f2f2f2;
              }
              .head {
                margin: 1em;
              }
            </style>
          </head>
          <body>
            <div class="head">
              <p>Date: ${selectedDate.toDateString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Machine</th>
                  ${filteredReadings
                    .map((reading) => {
                      return (
                        "<th>" +
                        moment(reading.created_at).format("HH:mm") +
                        "</th>"
                      );
                    })
                    .join("\n")}
                </tr>
              </thead>
              <tbody>
                    ${groupEquipments
                      .map((equipment) => {
                        const equipmentReadings = filteredReadings.filter(
                          (reading) => reading.uid === equipment.id
                        );

                        return `
                        <tr>
                          <td>${equipment.name}</td>
                          ${
                            equipmentReadings.length > 0
                              ? equipmentReadings
                                  .map(
                                    (reading) => `
                              <td>
                                <p>Inlet: ${reading.inletPressure}</p>
                                <p>Outlet: ${reading.outletPressure}</p>
                                <p>Diff: ${reading.diffPressureIndication}</p>
                                <p>
                                  Oil Status: ${
                                    reading.oilPressureStatus || "N/A"
                                  }
                                </p>
                              </td>
                            `
                                  )
                                  .join("\n")
                              : `<td></td>`
                          }
                        </tr>
                      `;
                      })
                      .join("\n")}
              </tbody>
            </table>
          </body>
        </html>
      `;

      console.log(" \n", printData);

      await Print.printAsync({ html: printData });
      // await Print.printAsync({ html: printData });
    }
  };

  return (
    <View style={styles.container}>
      <Text category="h3" style={styles.headerText}>
        Readings for {id}
      </Text>
      <View style={styles.filterContainer}>
        <Text category="h6" style={styles.dateLabel}>
          Filter by Date:
        </Text>
        <Datepicker
          date={selectedDate}
          onSelect={handleDateChange}
          style={styles.datePicker}
        />
        <Button onPress={handlePrint} style={styles.printButton}>
          Print
        </Button>
      </View>
      <ScrollView contentContainerStyle={styles.verticalScrollView}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.horizontalScrollView}
        >
          <View ref={tableRef}>
            <View style={styles.tableHeader}>
              <Text
                category="s1"
                style={[styles.tableHeaderCell, styles.fixedCell]}
              >
                Machine Name
              </Text>
              {filteredReadings.length > 0 &&
                filteredReadings.map((reading) => (
                  <Text
                    key={reading.created_at.toString()}
                    category="s1"
                    style={styles.tableHeaderCell}
                  >
                    {moment(reading.created_at).format("HH:mm")}
                  </Text>
                ))}
            </View>
            {groupEquipments.map((equipment) => {
              const equipmentReadings = filteredReadings.filter(
                (reading) => reading.uid === equipment.id
              );

              return (
                <View key={equipment.id} style={styles.tableRow}>
                  <Text
                    category="s1"
                    style={[styles.tableCell, styles.fixedCell]}
                  >
                    {equipment.name}
                  </Text>
                  {equipmentReadings.length > 0 ? (
                    equipmentReadings.map((reading) => (
                      <View
                        key={reading.created_at.toString()}
                        style={styles.tableCell}
                      >
                        <Text category="s2" style={styles.readingText}>
                          Inlet: {reading.inletPressure}
                        </Text>
                        <Text category="s2" style={styles.readingText}>
                          Outlet: {reading.outletPressure}
                        </Text>
                        <Text category="s2" style={styles.readingText}>
                          Diff: {reading.diffPressureIndication}
                        </Text>
                        <Text category="s2" style={styles.readingText}>
                          Oil Status: {reading.oilPressureStatus || "N/A"}
                        </Text>
                        <Button
                          onPress={() => handleImageView(reading.oilLevel)}
                          style={styles.imageButton}
                          size="tiny"
                        >
                          View Image
                        </Button>
                      </View>
                    ))
                  ) : (
                    <Text category="s2" style={styles.noReadingsText}>
                      No readings
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
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
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  dateLabel: {
    marginBottom: 8
  },
  datePicker: {
    flex: 1,
    marginRight: 8
  },
  printButton: {
    marginLeft: 8
  },
  verticalScrollView: {
    paddingBottom: 16
  },
  horizontalScrollView: {
    flexDirection: "column"
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderColor: "#ccc"
  },
  tableHeaderCell: {
    width: 150,
    textAlign: "center",
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8
  },
  fixedCell: {
    width: 150
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottomWidth: 0.5,
    borderColor: "#ccc"
  },
  tableCell: {
    width: 150,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8
  },
  readingText: {
    textAlign: "center",
    marginVertical: 4
  },
  noReadingsText: {
    flex: 1,
    textAlign: "center",
    padding: 8
  },
  imageButton: {
    marginTop: 8,
    alignSelf: "center"
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
