import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export interface FilterParams {
    statusFilter: 'open' | 'closed' | 'all';
    searchQuery: string;
    sortOrder: 'asc' | 'desc';
}

interface OwnerSurveyFilterProps {
    onFilterChange: (filters: FilterParams) => void;
}

const OwnerSurveyFilter: React.FC<OwnerSurveyFilterProps> = ({ onFilterChange }) => {
    const [statusFilter, setStatusFilter] = useState<"open" | "closed" | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            onFilterChange({ statusFilter, searchQuery, sortOrder });
        }, 1000);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [statusFilter, searchQuery, sortOrder]);

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
                    selectedValue={statusFilter}
                    style={styles.picker}
                    onValueChange={(itemValue) => setStatusFilter(itemValue)}
                >
                    <Picker.Item label="Все" value="all" />
                    <Picker.Item label="Открытые" value="open" />
                    <Picker.Item label="Закрытые" value="closed" />
                </Picker>

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

export default OwnerSurveyFilter;