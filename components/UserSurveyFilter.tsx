import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export interface FilterParams {
    searchQuery: string;
    sortOrder: 'asc' | 'desc';
}

interface UserSurveyFilterProps {
    onFilterChange: (filters: FilterParams) => void;
}

const UserSurveyFilter: React.FC<UserSurveyFilterProps> = ({ onFilterChange }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            onFilterChange({ searchQuery, sortOrder });
        }, 1000);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchQuery, sortOrder]);

    return (
        <View style={styles.filterContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Поиск по названию"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={sortOrder}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSortOrder(itemValue)}
                >
                    <Picker.Item label="По времени" value="asc" />
                    <Picker.Item label="По алфавиту" value="desc" />
                </Picker>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#f8f9fa",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 10,
        gap: 16,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    pickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    picker: {
        width: 100,
        height: 40,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 18,
    },
});

export default UserSurveyFilter;