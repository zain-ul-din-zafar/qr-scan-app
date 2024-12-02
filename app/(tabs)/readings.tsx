import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  ViewComponent
} from "react-native";
import { Text, Button, Datepicker, Spinner } from "@ui-kitten/components";
import { useLocalSearchParams } from "expo-router";
import useReadings, { Reading } from "@/hooks/useReadings";
import { useComposeEquipments } from "@/hooks/useComposeEquipments";
import moment from "moment";
import ImageViewer from "react-native-image-zoom-viewer";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as ImageManipulator from "expo-image-manipulator";
import { cardTemplate, RENDER } from "@/templates";
import { csvToJSON } from "@/lib/json-csv";

export default function ReadingsScreen() {
  const { id } = useLocalSearchParams() as any as { id: string };
  const { readings, deleteReading } = useReadings();
  const allEquipments = useComposeEquipments();
  const groupEquipments = allEquipments[id as keyof typeof allEquipments];

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filteredReadings, setFilteredReadings] = useState<Reading[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const tableRef = useRef<any>(null);

  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    // Function to convert image URI to base64
    const convertURIToBase64 = async (filePath: string) => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) {
          return "";
        }
        const result = await ImageManipulator.manipulateAsync(filePath, [], {
          base64: true
        });
        return result.base64 || "";
      } catch (err) {
        console.log("Error converting URI to base64 -- ", err);
        return "";
      }
    };

    // Collect all base64 images
    const imagePromises = filteredReadings.map(async (reading) => {
      if (reading.oilLevel) {
        const base64Image = await convertURIToBase64(reading.oilLevel);
        return {
          created_at: reading.created_at,
          base64Image,
          readingId: reading.uid
        };
      }
      return {
        created_at: reading.created_at,
        base64Image: "",
        readingId: reading.uid
      };
    });

    // Wait for all base64 images to be processed
    const imagesWithBase64 = await Promise.all(imagePromises);

    const readingsCard = filteredReadings.map((reading) => {
      const image = imagesWithBase64.find(
        (img) =>
          img.created_at === reading.created_at && img.readingId === reading.uid
      );
      const machine = Object.values(allEquipments)
        .flat(1)
        .find((i) => i.id === reading.uid);
      return cardTemplate(
        reading,
        image?.base64Image || "",
        machine?.name || "unknown"
      );
    });
    const html = RENDER(
      readingsCard.join("\n"),
      `<p>Date Time: ${selectedDate.toUTCString()}</p>
            <p>Group: ${id}</p>`
    );

    // Print to PDF
    const res = await Print.printToFileAsync({ html });
    const pdfName = `${res.uri.slice(
      0,
      res.uri.lastIndexOf("/") + 1
    )}Log-sheet-report-design_${id}(${new Date().toDateString()}).pdf`;

    try {
      await FileSystem.moveAsync({
        from: res.uri,
        to: pdfName
      });

      if (await FileSystem.getInfoAsync(pdfName)) {
        await Sharing.shareAsync(pdfName);
      } else {
        console.log("Failed to save PDF file");
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }

    setLoading(false);
  };

  const handleExportCSV = async () => {
    const textFields = filteredReadings.map(({ oilLevel, ...rest }) => ({
      ...rest
    }));

    setLoading(true);

    const csv = csvToJSON(textFields);
    const uri = `${
      FileSystem.documentDirectory
    }Log-sheet-report-design_${id}(${new Date().toDateString()}).csv`;

    await FileSystem.writeAsStringAsync(uri, csv, {
      encoding: FileSystem.EncodingType.UTF8
    });

    if (await FileSystem.getInfoAsync(uri)) {
      await Sharing.shareAsync(uri);
    } else {
      console.log("Failed to save CSV file");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text category="h5" style={styles.headerText}>
        Readings for {id}
      </Text>
      <View style={styles.filterContainer}>
        <Datepicker
          date={selectedDate}
          onSelect={handleDateChange}
          style={styles.datePicker}
        />
        <Button onPress={handleExportCSV} disabled={loading}>
          CSV
        </Button>
        <Button
          onPress={handlePrint}
          style={styles.printButton}
          disabled={loading}
          status="outline"
          appearance={loading ? "outline" : "filled"}
          accessoryLeft={() =>
            loading ? (
              <Spinner
                size="sm"
                style={{
                  width: 13,
                  height: 13
                }}
                status="warning"
              />
            ) : (
              <></>
            )
          }
        >
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
                  {filteredReadings.length > 0 ? (
                    filteredReadings.map((reading) => {
                      const isInFilterReadings = equipmentReadings.some(
                        (v) => v.created_at === reading.created_at
                      );

                      if (!isInFilterReadings) {
                        return (
                          <View
                            key={reading.created_at.toString()}
                            style={styles.tableCell}
                          >
                            <Text>X</Text>
                          </View>
                        );
                      }

                      return (
                        <View
                          key={reading.created_at.toString()}
                          style={styles.tableCell}
                        >
                          <Text category="s2" style={styles.readingText}>
                            Status: {reading.newOptionStatus || "unknown"}
                          </Text>
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
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 2
                            }}
                          >
                            <Button
                              onPress={() => handleImageView(reading.oilLevel)}
                              style={[styles.imageButton]}
                              size="tiny"
                            >
                              View Image
                            </Button>
                            {new Date(reading.created_at).toDateString() ===
                              new Date().toDateString() && (
                              <Button
                                size="tiny"
                                status="danger"
                                style={styles.imageButton}
                                onPress={() => {
                                  deleteReading(
                                    equipment.id,
                                    reading.created_at
                                  );
                                }}
                              >
                                Delete
                              </Button>
                            )}
                          </View>

                          {reading.comment && (
                            <View style={{ marginTop: 4 }}>
                              <Text>{reading.comment}</Text>
                            </View>
                          )}
                        </View>
                      );
                    })
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
    marginBottom: 16,
    marginTop: 8
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
  spinner: {
    color: "white"
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
