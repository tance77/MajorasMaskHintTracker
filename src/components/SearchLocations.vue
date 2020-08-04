<template>
    <div class="relative">
        <div v-show="Object.entries(selectedLocation).length === 0">
            <label :for="uniqueLabelId1" class="block font-medium leading-5 text-gray-300">{{ label }}</label>
            <div class="mt-1 rounded-md shadow-sm">
                <input :id="uniqueLabelId1" v-model="search" :class="{'rounded-b-none focus:shadow-none': showResults}" :placeholder="placeholder" class="block w-full p-3 text-gray-300 bg-gray-800 border-2 border-transparent rounded-md focus:border-indigo-600 focus:outline-none">
            </div>
            <transition
                enter-active-class="transition duration-100 ease-out"
                enter-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
            >
                <div v-show="showResults" v-on-clickaway="away" class="absolute z-10 w-full text-gray-300 bg-gray-800 border-b border-l border-r border-indigo-600 rounded-b shadow-sm">
                    <ul class="overflow-auto" style="max-height: 500px;">
                        <li v-for="(location, key) in searchResults" :key="key" class="px-3 py-2 cursor-pointer hover:bg-gray-700" @click="handleSearchSelect(location)">
                            <span v-if="location.name">
                                {{ location.name }}
                            </span>
                            <span v-else>{{ location }}</span>
                        </li>
                        <li v-show="!searchResults.length" class="px-3 py-2">
                            No results found.
                        </li>
                    </ul>
                </div>
            </transition>
        </div>
        <div v-show="Object.entries(selectedLocation).length !== 0">
            <label :for="uniqueLabelId2" class="block font-medium leading-5 text-gray-300">{{ label }}</label>
            <div class="relative mt-1 rounded-md shadow-sm">
                <input :id="uniqueLabelId2" v-model="selectedLocation.name" class="block w-full p-3 text-gray-300 bg-gray-700 border-2 border-transparent rounded-md opacity-50 focus:border-indigo-600 focus:outline-none" disabled>
                <button class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-red-400 rounded-tr-lg hover:text-red-600 focus:outline-none" @click="removeSelected">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path clip-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" fill-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mixin as clickaway} from "vue-clickaway";

    export default {
        name: "SearchLocations",
        mixins: [clickaway],
        props: {
            options: {type: Array, default: () => []},
            selectedLocation: {
                type: Object, default: () => {},
            },
            label: {type: String, default: null},
            placeholder: {type: String, default: null},
        },
        data() {
            return {
                search: null,
                searchResults: [],
                showResults: false,
                uniqueLabelId1: Math.random().toString(36).substring(2) + Date.now().toString(36),
                uniqueLabelId2: Math.random().toString(36).substring(2) + Date.now().toString(36),
            };
        },
        watch: {
            search(search) {
                if (!search) {
                    this.searchResults = [];
                    this.showResults = false;
                    return;
                }
                let searchStrings = search.split(" ");
                let unsortedResults = this.options.filter(location => {
                    let includes = true;
                    for (let i = 0; i < searchStrings.length; i++) {
                        if (!searchStrings[i]) {
                            continue;
                        }
                        if (location.name) {
                            if (!location.name.toLowerCase().includes(searchStrings[i].toLowerCase())) {
                                includes = false;
                            }
                        } else {
                            if (!location.toLowerCase().includes(searchStrings[i].toLowerCase())) {
                                includes = false;
                            }
                        }
                    }
                    if (includes === true) {
                        return location;
                    }
                });
                this.searchResults = unsortedResults.sort((a, b) => {
                    if (a.name && b.name) {
                        if (a.name.toLowerCase() > b.name.toLowerCase()) {
                            return 1;
                        }
                        if (b.name.toLowerCase() > a.name.toLowerCase()) {
                            return -1;
                        }
                    } else if (a.name && !b.name) {
                        if (a.name.toLowerCase() > b.toLowerCase()) {
                            return 1;
                        }
                        if (b.toLowerCase() > a.name.toLowerCase()) {
                            return -1;
                        }
                    } else if (!a.name && b.name) {
                        if (a.toLowerCase() > b.name.toLowerCase()) {
                            return 1;
                        }
                        if (b.name.toLowerCase() > a.toLowerCase()) {
                            return -1;
                        }
                    } else if (!a.name && !b.name) {
                        if (a.toLowerCase() > b.toLowerCase()) {
                            return 1;
                        }
                        if (b.toLowerCase() > a.toLowerCase()) {
                            return -1;
                        }
                    }
                    return 0;
                });
                this.showResults = true;
            },
        },
        methods: {
            away() {
                this.search = null;
                this.searchResults = [];
            },
            removeSelected() {
                this.$emit("selected", {});
            },
            handleSearchSelect(location) {
                this.search = null;
                this.searchResults = [];
                this.$emit("selected", location);
            },
        },
    };
</script>

<style scoped>
</style>
