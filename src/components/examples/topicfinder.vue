<template>
    <v-app>
        <v-container>
            <v-layout row>
                <v-container>
                    <v-flex xs8 offset-sm2>
                        <v-card class="card--flex-toolbar round-card">
                            <v-toolbar flat color="indigo" dark>
                                <v-toolbar-title class="body-2">Find a Topic</v-toolbar-title>

                                <v-spacer></v-spacer>

                                <v-slide-x-reverse-transition>
                                    <v-flex xs6 v-if="searchToggled">
                                        <v-combobox
                                                rounded
                                                light
                                                v-model="model"
                                                :filter="filter"
                                                :hide-no-data="!search"
                                                :items="items"
                                                :search-input.sync="search"
                                                hide-selected
                                                label="Search for a topic"
                                                multiple
                                                small-chips
                                                solo
                                                class="adjustPosition"
                                                clearable
                                                color="indigo"
                                        >
                                            <template v-slot:no-data>
                                                <v-list>
                                                    <v-list-item>
                                                        <v-flex shrink pr-1>
                                                            <v-list-item-content>
                                                                <v-list-item-title>Create</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-flex>
                                                        <v-chip
                                                                :color="`${colors[nonce - 1]} lighten-3`"
                                                                style="float: left"
                                                                small
                                                        >
                                                            {{ search }}
                                                        </v-chip>
                                                    </v-list-item>
                                                </v-list>
                                            </template>
                                            <template v-slot:selection="{ item, parent, selected }">
                                                <v-chip
                                                        v-if="item === Object(item)"
                                                        :color="`${item.color} lighten-3`"
                                                        :value="selected"
                                                        small
                                                >
                                                <span class="pr-2">
                                                  {{ item.text }}
                                                </span>
                                                    <v-icon
                                                            small
                                                            @click="parent.selectItem(item)"
                                                    >close
                                                    </v-icon>
                                                </v-chip>
                                            </template>
                                            <template v-slot:item="{ index, item }">
                                                <v-list-item-content>
                                                    <v-text-field
                                                            v-if="editing === item"
                                                            v-model="editing.text"
                                                            autofocus
                                                            flat
                                                            background-color="transparent"
                                                            hide-details
                                                            solo
                                                            @keyup.enter="edit(index, item)"
                                                    ></v-text-field>
                                                    <v-flex v-else>
                                                        <v-chip

                                                                :color="`${item.color} lighten-3`"
                                                                dark
                                                                small
                                                        >
                                                            {{ item.text }}
                                                        </v-chip>
                                                    </v-flex>
                                                </v-list-item-content>
                                                <v-spacer></v-spacer>
                                                <v-list-item-action @click.stop>
                                                    <v-btn
                                                            icon
                                                            @click.stop.prevent="edit(index, item)"
                                                    >
                                                        <v-icon>{{ editing !== item ? 'edit' : 'check' }}</v-icon>
                                                    </v-btn>
                                                </v-list-item-action>
                                            </template>
                                        </v-combobox>
                                    </v-flex>
                                </v-slide-x-reverse-transition>


                                <v-btn icon @click="searchToggled = !searchToggled">
                                    <v-icon>search</v-icon>
                                </v-btn>

                                <v-menu transition="slide-y-transition">
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                                icon
                                                v-on="on"
                                        >
                                            <v-icon>more_vert</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list dense subheader>
                                        <v-list-item>
                                            <v-subheader>
                                                Search Options
                                            </v-subheader>
                                        </v-list-item>
                                        <v-list-item @click="setSearchType('exact')">
                                            <v-list-item-title>
                                                Exact Match
                                            </v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="setSearchType('partial')">
                                            <v-list-item-title>
                                                Partial Match
                                            </v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-toolbar>

                            <v-divider></v-divider>


                            <v-flex xs12 v-if="model.length === 0">
                                <v-container>
                                    <v-subheader>
                                        <span class="mx-auto">Press the <v-icon small>search</v-icon> button to search for a topic!</span>
                                    </v-subheader>
                                </v-container>
                            </v-flex>
                            <v-flex xs12 v-else-if="model.length > 0 && searchedTopics.length === 0">
                                <v-container>
                                    <v-subheader>
                                        <span class="mx-auto">No results found!</span>
                                    </v-subheader>
                                </v-container>
                            </v-flex>
                            <v-flex xs12 mb-3 v-else>
                                <v-expansion-panels accordion>
                                    <v-expansion-panel v-for="(topic, i) in searchedTopics"
                                                       :key="i"
                                    >
                                        <v-expansion-panel-header expand-icon="arrow_drop_down">
                                            <div>
                                                {{ topic.topicName }}
                                                <div>
                                                    <v-list-item-action-text
                                                            class="caption text-capitalize text--black text--lighten3">
                                                        {{ topic.layer }}
                                                    </v-list-item-action-text>
                                                </div>
                                            </div>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-card-text>
                                                {{ topic.desc }}
                                                <div>
                                                    <v-flex py-3>
                                                        <v-divider></v-divider>
                                                    </v-flex>
                                                    <v-flex mr-1 v-for="tag in topic.tags" d-inline>
                                                        <v-chip small>
                                                            {{ tag }}
                                                        </v-chip>
                                                    </v-flex>
                                                </div>
                                            </v-card-text>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-flex>
                        </v-card>
                    </v-flex>
                </v-container>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
    import common from '../../common.js'
    import database from '../../firebaseInit.js'

    export default {
        name: "find-topic",
        data() {
            return {
                activator: null,
                attach: null,
                colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
                editing: null,
                index: -1,
                items: [
                    {header: 'Select a keyword or create one'},
                ],
                nonce: 1,
                menu: false,
                model: [],
                x: 0,
                search: null,
                searchToggled: false,
                searchType: 'exact',
                topics: [],
                y: 0
            };
        },
        watch: {
            model(val, prev) {
                if (val.length === prev.length) return;

                this.model = val.map(v => {
                    if (typeof v === 'string') {
                        v = {
                            text: v,
                            color: this.colors[this.nonce - 1]
                        };

                        this.items.push(v);

                        this.nonce++
                    }

                    return v
                })
            }
        },
        methods: {
            edit(index, item) {
                if (!this.editing) {
                    this.editing = item
                    this.index = index
                } else {
                    this.editing = null
                    this.index = -1
                }
            },
            filter(item, queryText, itemText) {
                if (item.header) return false

                const hasValue = val => val != null ? val : ''

                const text = hasValue(itemText)
                const query = hasValue(queryText)

                return text.toString()
                    .toLowerCase()
                    .indexOf(query.toString().toLowerCase()) > -1
            },
            setSearchType(val) {
                console.log("Search type: " + val);
                this.searchType = val;
            }
        },
        computed: {
            searchedTopics() {
                let matchTags = this.model.map((topic) => topic.text.toLowerCase());
                let searchedTopics = [];
                let matches = [];
                let topic;
                let tag;

                if (this.searchType === 'exact') {
                    // Iterate through topics
                    for (let i in this.topics) {
                        topic = this.topics[i];

                        // Iterate through tags in each topic
                        for (let j in topic.tags) {
                            tag = topic.tags[j].toLowerCase();

                            // Iterate through topics to match against
                            for (let k in matchTags) {
                                if (tag === matchTags[k] && !searchedTopics.includes(topic)) {
                                    matches.push(true);
                                }
                            }
                        }

                        // If all of current topic's tags match all of the searched tags, add the topic to the array
                        if (matches.length) {
                            // If each value in matches is true and has a length equal to topic.tags.length
                            if (matches.filter(Boolean).length === matchTags.length) {
                                searchedTopics.push(topic);
                            }
                            matches = [];
                        }
                    }

                    return searchedTopics;
                } else if (this.searchType === 'partial') {
                    // Iterate through topics
                    for (let i in this.topics) {
                        topic = this.topics[i];

                        // Iterate through tags in each topic
                        for (let j in topic.tags) {
                            tag = topic.tags[j].toLowerCase();

                            // Iterate through topics to match against
                            for (let k in matchTags) {
                                if (tag === matchTags[k] && !searchedTopics.includes(topic)) {
                                    searchedTopics.push(topic);
                                }
                            }
                        }
                    }

                    return searchedTopics;
                }
                return [];
            }
        },
        created() {
            let self = this;
            database.collection('topics').onSnapshot(snapshot => {
                snapshot.docChanges().forEach(function (change) {
                    let doc = change.doc.data();
                    // Add new elements to the array
                    if (change.type === "added") {
                        self.topics.push({
                            topicName: doc.topicName,
                            layer: doc.layer,
                            desc: doc.desc,
                            tags: doc.tags,
                            id: change.doc.id
                        });
                    } else if (change.type === "modified") {
                        self.topics = self.topics.filter(e => e.id !== doc.id);
                        self.topics.push({
                            topicName: doc.topicName,
                            layer: doc.layer,
                            desc: doc.desc,
                            tags: doc.tags,
                            id: change.doc.id
                        });
                        self.selected = [];
                    }
                    // Remove elements from the array
                    if (change.type === "removed") {
                        self.topics = self.topics.filter(e => e.id !== doc.id)
                    }
                });
            })
        }
    }
</script>

<style scoped>
    .searchTags {
        position: relative;
        top: 8px;
    }

    .adjustPosition {
        position: relative;
        top: 15px;
        right: 5px;
    }
</style>