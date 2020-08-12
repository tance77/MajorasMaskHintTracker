<template>
  <div class="container p-2 mx-auto mt-6">
    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div class="grid-cols-1">
        <SearchLocations
          :options="locations"
          label="Location"
          placeholder="Cow Grotto"
          :selected-location="selectedLocation"
          @selected="handleLocationSelect"
        />
      </div>
      <div class="grid-cols-1">
        <SearchItems
          :options="items"
          label="Items"
          placeholder="Big Bomb Bag"
          :selected-item="selectedItem"
          @selected="handleItemSelect"
        />
      </div>
    </div>
    <div class="mt-3 text-right">
      <button
        type="submit"
        class="w-full p-3 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-purple-600 border border-transparent rounded-md md:px-4 md:py-2 md:w-24 hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-purple active:bg-purple-700 disabled:opacity-25 disabled:cursor-not-allowed"
        :disabled="Object.keys(selectedLocation).length === 0 || Object.keys(selectedItem).length === 0"
        @click="addHint"
      >
        Add
      </button>
    </div>
    <div class="flex items-center my-4 text-gray-300 border-b border-gray-500">
      <div class="text-xl tracking-wide">
        Regions
      </div>
      <div class="flex flex-grow ml-2">
        <div class="flex items-center">
          <div class="inline-flex w-4 h-4 bg-teal-700 border border-teal-400 rounded opacity-25"/>
          <span class="ml-2 text-xs tracking-wider">WOTH</span>
        </div>
        <div class="flex items-center ml-2">
          <div class="w-4 h-4 bg-purple-800 border border-purple-400 rounded opacity-25"/>
          <span class="ml-2 text-xs tracking-wider">Foolish</span>
        </div>
      </div>
    </div>
    <div class="grid grid-flow-row md:grid-flow-col grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-10 md:grid-rows-20" style="">
      <div v-for="region in regions" :key="region" class="flex items-center col-span-1">
        <span class="w-3/4 text-gray-300">{{ splitRegionName(region) }}</span>
        <label class="pr-2">
          <input
            v-model="selectedWayOfHero"
            :value="region"
            class="text-teal-400 bg-teal-700 border border-teal-400 form-checkbox focus:shadow-none"
            type="checkbox"
            :class="{'opacity-25': !selectedWayOfHero.includes(region)}"
            @click="toggleWoth(region, true)"
          >
        </label>
        <label>
          <input
            v-model="selectedFoolish"
            :value="region"
            class="text-purple-400 bg-purple-800 border border-purple-400 form-checkbox focus:shadow-none"
            type="checkbox"
            :class="{'opacity-25': !selectedFoolish.includes(region)}"
            @click="toggleWoth(region, false)"
          >
        </label>
      </div>
    </div>
    <div class="my-4 text-xl tracking-wide text-gray-300 border-b border-gray-500">
      Known Hints
    </div>
    <div v-show="sortedWayOfTheHero.length > 0 || sortedFoolish.length > 0" class="grid grid-cols-1 gap-2 mt-4 lg:grid-cols-2">
      <div class="col-span-1 p-2 bg-teal-500 bg-opacity-25 rounded">
        <span class="text-lg tracking-wide text-teal-300 font-semibold">Way of the Hero</span>
        <div class="grid grid-cols-1 overflow-y-auto ml-4">
          <div v-for="region in sortedWayOfTheHero" :key="`woth-${region}`" class="col-span-1 text-gray-300">
            {{ splitRegionName(region) }}
          </div>
        </div>
      </div>
      <div class="col-span-1 p-2 bg-purple-500 bg-opacity-25 rounded">
        <span class="text-lg tracking-wide text-purple-300 font-semibold">Foolish</span>
        <div class="grid grid-cols-1 overflow-y-auto ml-4">
          <div v-for="region in sortedFoolish" :key="`foolish-${region}`" class="col-span-1 text-gray-300">
            {{ splitRegionName(region) }}
          </div>
        </div>
      </div>
    </div>

    <div v-show="Object.keys(regionHints).length > 0" class="grid grid-cols-1 gap-2 mt-4 lg:grid-cols-2">
      <div v-for="(hints, region) in regionHints" :key="region" class="p-2 bg-gray-800 rounded">
        <span class="text-lg font-semibold tracking-wide text-gray-500">{{ splitRegionName(region) }}</span>
        <div
          v-for="(hint, index) in hints"
          :key="`${hint}-${index}`"
          class="flex items-center mt-2 mb-2 ml-4 font-thin text-gray-300"
        >
          <span class="col-span-1">{{ hint.locationName }}</span>
          <div class="flex items-center mx-2 text-teal-500">
            <svg fill="currentColor" viewBox="0 0 20 20" class="inline-flex w-4">
              <path
                fill-rule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <span class="col-span-1 mr-2 font-semibold">{{ hint.item }}</span>
          <img v-if="hint.image" :src="assembleImagePath(hint.image)" class="w-6 h-6 mr-2">
          <button
            class="flex items-center text-gray-400 hover:text-red-600 focus:outline-none"
            @click="removeHint(region, hint)"
          >
            <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      v-show="Object.keys(regionHints).length < 1 && sortedWayOfTheHero.length < 1 && sortedFoolish.length < 1"
      class="text-sm text-gray-400"
    >
      Hints added via the text boxes above will appear here...
    </div>

    <div class="mt-8 text-right">
      <button
        class="w-full p-3 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-red-600 border border-transparent rounded-md md:px-4 md:py-2 md:w-24 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700"
        @click="showResetModal = true"
      >
        Reset
      </button>
    </div>
    <ResetModal
      :open="showResetModal"
      @confirm-delete="resetRegionHints"
      @cancel="showResetModal = false"
    />
    <!--        <Notification :show="showNotification" :message="message" @close="handleNotificationClose"/>-->
  </div>
</template>

<script>
  import SearchLocations from "./SearchLocations";
  import SearchItems from "./SearchItems";
  import ResetModal from "./ResetModal";
  // import Notification from "./Notification";

  export default {
    name: "HintTracker",
    components: {ResetModal, SearchItems, SearchLocations},
    data() {
      return {
        selectedLocation: {},
        selectedItem: {},
        items: [
          {name: "5 Bombchu", image: "Bombchu.png"},
          {name: "10 Arrows", image: ""},
          {name: "10 Bombchu", image: "Bombchu.png"},
          {name: "10 Bombs", image: "Bomb.png"},
          {name: "10 Deku Nuts", image: "Deku Nut.png"},
          {name: "30 Arrows", image: ""},
          {name: "50 Arrows", image: ""},
          {name: "Adult Wallet", image: "Adult's Wallet.png"},
          {name: "All Night Mask", image: "All-Night Mask.png"},
          {name: "Big Bomb Bag", image: "Bomb Bag 30.png"},
          {name: "Biggest Bomb Bag", image: "Bomb Bag 40.png"},
          {name: "Blast Mask", image: "Blast Mask.png"},
          {name: "Blue Potion",image: "bottle_potion_blue.png"},
          {name: "Blue Rupee", image: "Rupee Icon (Blue).png"},
          {name: "Bomb Bag", image: "Bomb Bag 20.png"},
          {name: "Bombchu", image: "Bombchu.png"},
          {name: "Bombers' Notebook", image: "Bombers' Notebook.png"},
          {name: "Bottle with Chateau Romani", image: "Chateau Romani.png"},
          {name: "Bottle with Gold Dust", image: "Gold Dust.png"},
          {name: "Bottle with Milk", image: "Milk.png"},
          {name: "Bottle with Red Potion", image: "Red Potion.png"},
          {name: "Bottle: Big Poe", image: "Big Poe.png"},
          {name: "Bottle: Bug", image: "bottle_bug.png"},
          {name: "Bottle: Deku Princess", image: "bottle_princess.png"},
          {name: "Bottle: Fairy",image: "bottle_fairy.png"},
          {name: "Bottle: Fish", image: "Fish.png"},
          {name: "Bottle: Hot Spring Water", image: "bottle_water_hot.png"},
          {name: "Bottle: Mushroom", image: "bottle_mushroom.png"},
          {name: "Bottle: Poe", image: "bottle_poe.png"},
          {name: "Bottle: Spring Water", image: "bottle_water.png"},
          {name: "Bottle: Zora Egg", image: "bottle_egg.png"},
          {name: "Bremen Mask", image: "Bremen Mask.png"},
          {name: "Bunny Hood", image: "Bunny Hood.png"},
          {name: "Captain's Hat", image: "Captain's Hat.png"},
          {name: "Chateau Romani", image: "Chateau Romani.png"},
          {name: "Circus Leader's Mask", image: "Circus Leader's Mask.png"},
          {name: "Clock Town Stray Fairy",image: "clocktown_fairy.png"},
          {name: "Couple's Mask", image: "Couple's Mask.png"},
          {name: "Deku Mask", image: "Deku Mask.png"},
          {name: "Deku Stick", image: "Deku Stick.png"},
          {name: "Don Gero's Mask", image: "Don Gero's Mask.png"},
          {name: "Double Defense", image: ""},
          {name: "Elegy of Emptiness", image: "song_elegy.png"},
          {name: "Empty Bottle", image: "Empty Bottle.png"},
          {name: "Epona's Song", image: "song_epona.png"},
          {name: "Extended Magic Power", image: "magic.png"},
          {name: "Fairy", image: ""},
          {name: "Fierce Deity's Mask", image: "Fierce Deity's Mask.png"},
          {name: "Fire Arrow",image: "Fire Arrow.png"},
          {name: "Garo's Mask", image: "Garo's Mask.png"},
          {name: "Giant Wallet", image: "Giant's Wallet.png"},
          {name: "Giant's Mask", image: "Giant's Mask.png"},
          {name: "Gibdo Mask", image: "Gibdo Mask.png"},
          {name: "Gilded Sword", image: "Gilded Sword.png"},
          {name: "Gold Rupee", image: "Rupee Icon (Gold).png"},
          {name: "Goron Lullaby", image: "song_lullaby.png"},
          {name: "Goron Mask", image: "Goron Mask.png"},
          {name: "Great Bay Boss Key", image: "dungeon_key_boss.png"},
          {name: "Great Bay Compass", image: "dungeon_compass.png"},
          {name: "Great Bay Map", image: "dungeon_map.png"},
          {name: "Great Bay Small Key", image: "dungeon_key_small.png"},
          {name: "Great Bay Stray Fairy",image: "dungeon_key_small.png"},
          {name: "Great Fairy's Mask", image: "Great Fairy's Mask.png"},
          {name: "Great Fairy's Sword", image: "Great Fairy's Sword.png"},
          {name: "Green Potion", image: "bottle_potion_green.png"},
          {name: "Heart Container", image: "heart_container.png"},
          {name: "Hero's Bow", image: "Hero's Bow.png"},
          {name: "Hero's Shield", image: "Hero's Shield.png"},
          {name: "Hookshot", image: "Hookshot.png"},
          {name: "Ice Arrow", image: "Ice Arrow.png"},
          {name: "Kafei's Mask", image: "Kafei's Mask.png"},
          {name: "Kamaro's Mask", image: "Kamaro's Mask.png"},
          {name: "Keaton Mask", image: "Keaton Mask.png"},
          {name: "Kokiri Sword",image: "Kokiri Sword.png"},
          {name: "Land Title Deed", image: "Land Title Deed.png"},
          {name: "Large Quiver", image: "Hero's Bow 40.png"},
          {name: "Largest Quiver", image: "Hero's Bow 50.png"},
          {name: "Lens of Truth", image: "Lens of Truth.png"},
          {name: "Letter to Kafei", image: "Letter to Kafei.png"},
          {name: "Letter to Mama", image: "letter_mama.png"},
          {name: "Light Arrow", image: "Light Arrow.png"},
          {name: "Magic Bean", image: "Magic Beans.png"},
          {name: "Magic Power", image: "magic.png"},
          {name: "Map of Clock Town", image: "map.png"},
          {name: "Map of Great Bay", image: "map.png"},
          {name: "Map of Romani Ranch",image: "map.png"},
          {name: "Map of Snowhead", image: "map.png"},
          {name: "Map of Stone Tower", image: "map.png"},
          {name: "Map of Woodfall", image: "map.png"},
          {name: "Mask of Scents", image: "mask_scents.png"},
          {name: "Mask of Truth", image: "mask_truth.png"},
          {name: "Milk", image: "Milk.png"},
          {name: "Mirror Shield", image: "Mirror Shield.png"},
          {name: "Moon's Tear", image: "Moon's Tear.png"},
          {name: "Mountain Title Deed", image: "Mountain Title Deed.png"},
          {name: "New Wave Bossa Nova", image: "song_bossa_nova.png"},
          {name: "Oath to Order", image: "song_oath.png"},
          {name: "Ocean Skulltula Spirit", image: "skull_greatbay.png"},
          {name: "Ocean Title Deed",image: "Ocean Title Deed.png"},
          {name: "Pendant of Memories", image: "Pendant of Memories.png"},
          {name: "Pictobox", image: "Pictograph Box.png"},
          {name: "Piece of Heart", image: "heart_piece.png"},
          {name: "Postman's Hat", image: "Postman's Hat.png"},
          {name: "Powder Keg", image: "Powder Keg.png"},
          {name: "Purple Rupee", image: "Rupee Icon (Purple).png"},
          {name: "Razor Sword", image: "Razor Sword.png"},
          {name: "Red Potion", image: "Red Potion.png"},
          {name: "Red Rupee", image: "Rupee Icon (Red).png"},
          {name: "Romani's Mask", image: "Romani's Mask.png"},
          {name: "Room Key", image: "Room Key.png"},
          {name: "Seahorse", image: "bottle_seahorse.png"},
          {name: "Silver Rupee",image: "Rupee Icon (Silver).png"},
          {name: "Snowhead Boss Key", image: "dungeon_key_boss.png"},
          {name: "Snowhead Compass", image: "dungeon_compass.png"},
          {name: "Snowhead Map", image: "dungeon_map.png"},
          {name: "Snowhead Small Key", image: "dungeon_key_small.png"},
          {name: "Snowhead Stray Fairy", image: "snowhead_fairy.png"},
          {name: "Sonata of Awakening", image: "song_sonata.png"},
          {name: "Song of Healing", image: "song_healing.png"},
          {name: "Song of Soaring", image: "song_soaring.png"},
          {name: "Song of Storms", image: "song_storms.png"},
          {name: "Spin Attack", image: ""},
          {name: "Stone Mask", image: "Stone Mask.png"},
          {name: "Stone Tower Boss Key",image: "dungeon_key_boss.png"},
          {name: "Stone Tower Compass", image: "dungeon_compass.png"},
          {name: "Stone Tower Map", image: "dungeon_map.png"},
          {name: "Stone Tower Small Key", image: "dungeon_key_small.png"},
          {name: "Stone Tower Stray Fairy", image: "stonetower_fairy.png"},
          {name: "Swamp Skulltula Spirit", image: "skull_woodfall.png"},
          {name: "Swamp Title Deed", image: "Swamp Title Deed.png"},
          {name: "Woodfall Boss Key", image: "dungeon_key_boss.png"},
          {name: "Woodfall Compass", image: "dungeon_compass.png"},
          {name: "Woodfall Map", image: "dungeon_map.png"},
          {name: "Woodfall Small Key", image: "dungeon_key_small.png"},
          {name: "Woodfall Stray Fairy", image: "woodfall_fairy.png"},
          {name: "Zora Mask", image: "Zora Mask.png"}
        ],
        locations: [
          {name: "Aliens Defense", region: "RomaniRanch"},
          {name: "All Night Mask Purchase", region: "WestClockTown"},
          {name: "Anju and Kafei", region: "StockPotInn"},
          {name: "Astronomy Telescope", region: "TerminaField"},
          {name: "Baby Goron", region: "GoronVillage"},
          {name: "Baby Zoras", region: "GreatBayCoast"},
          {name: "Bad Pictograph of Lulu", region: "ZoraHall"},
          {name: "Bank Reward #1", region: "WestClockTown"},
          {name: "Bank Reward #2", region: "WestClockTown"},
          {name: "Bank Reward #3", region: "WestClockTown"},
          {name: "Bean Grotto",region: "DekuPalace"},
          {name: "Bean Man", region: "DekuPalace"},
          {name: "Beaver Race #1", region: "ZoraCape"},
          {name: "Beaver Race #2", region: "ZoraCape"},
          {name: "Behind Woodfall Owl Chest", region: "Woodfall"},
          {name: "Big Bomb Bag Purchase", region: "WestClockTown"},
          {name: "Biggest Bomb Bag Purchase", region: "GoronVillage"},
          {name: "Bio Baba Grotto", region: "TerminaField"},
          {name: "Boat Archery", region: "SouthernSwamp"},
          {name: "Bomb Bag Purchase", region: "WestClockTown"},
          {name: "Bomb Shop 10 Bombchu", region: "WestClockTown"},
          {name: "Bomb Shop 10 Bombs",region: "WestClockTown"},
          {name: "Bombers' Hide and Seek", region: "NorthClockTown"},
          {name: "Bombers' Hideout Chest", region: "EastClockTown"},
          {name: "Boss Blue Warp", region: "Misc"},
          {name: "Bottle: Big Poe", region: "BottleCatch"},
          {name: "Bottle: Bug", region: "BottleCatch"},
          {name: "Bottle: Deku Princess", region: "BottleCatch"},
          {name: "Bottle: Fairy", region: "BottleCatch"},
          {name: "Bottle: Fish", region: "BottleCatch"},
          {name: "Bottle: Hot Spring Water", region: "BottleCatch"},
          {name: "Bottle: Mushroom", region: "BottleCatch"},
          {name: "Bottle: Poe",region: "BottleCatch"},
          {name: "Bottle: Spring Water", region: "BottleCatch"},
          {name: "Bottle: Zora Egg", region: "BottleCatch"},
          {name: "Business Scrub Purchase", region: "TerminaField"},
          {name: "Butler", region: "DekuPalace"},
          {name: "Canyon Scrub Purchase", region: "IkanaCanyon"},
          {name: "Canyon Scrub Trade", region: "IkanaCanyon"},
          {name: "Captain Keeta's Chest", region: "IkanaGraveyard"},
          {name: "Clock Tower Entrance", region: "SouthClockTown"},
          {name: "Clock Town Map Purchase", region: "NorthClockTown"},
          {name: "Clock Town Scrub Trade",region: "SouthClockTown"},
          {name: "Clock Town Stray Fairy", region: "LaundryPool"},
          {name: "Cow Beneath the Well", region: "BeneathTheWell"},
          {name: "Cremia", region: "RomaniRanch"},
          {name: "Curiosity Shop Blue Rupee", region: "WestClockTown"},
          {name: "Curiosity Shop Gold Rupee", region: "WestClockTown"},
          {name: "Curiosity Shop Man #1", region: "LaundryPool"},
          {name: "Curiosity Shop Man #2", region: "LaundryPool"},
          {name: "Curiosity Shop Purple Rupee", region: "WestClockTown"},
          {name: "Curiosity Shop Red Rupee", region: "WestClockTown"},
          {name: "Dampe Digging",region: "IkanaGraveyard"},
          {name: "Darmani", region: "MountainVillage"},
          {name: "Day 1 Grave Bats", region: "IkanaGraveyard"},
          {name: "Day 1 Grave Tablet", region: "IkanaGraveyard"},
          {name: "Deku Palace West Garden", region: "DekuPalace"},
          {name: "Deku Playground Any Day", region: "NorthClockTown"},
          {name: "Deku Playground Three Days", region: "NorthClockTown"},
          {name: "Deku Trial Bonus", region: "TheMoon"},
          {name: "Dodongo Grotto", region: "TerminaField"},
          {name: "Dog Race", region: "RomaniRanch"},
          {name: "Doggy Racetrack Roof Chest", region: "RomaniRanch"},
          {name: "East Clock Town Chest",region: "EastClockTown"},
          {name: "Entrance to Woodfall Chest", region: "Woodfall"},
          {name: "Evan", region: "ZoraHall"},
          {name: "Fire Arrow Chest", region: "SnowheadTemple"},
          {name: "Fisherman Game", region: "GreatBayCoast"},
          {name: "Fisherman Pictograph", region: "GreatBayCoast"},
          {name: "Frog Choir", region: "MountainVillage"},
          {name: "Giant's Mask Chest", region: "StoneTowerTemple"},
          {name: "Goht Heart Container", region: "SnowheadTemple"},
          {name: "Good Pictograph of Lulu", region: "ZoraHall"},
          {name: "Gorman Bros Milk Purchase", region: "MilkRoad"},
          {name: "Gorman Bros Race",region: "MilkRoad"},
          {name: "Gorman", region: "EastClockTown"},
          {name: "Goron Race", region: "TwinIslands"},
          {name: "Goron Racetrack Grotto", region: "TwinIslands"},
          {name: "Goron Shop 10 Arrows", region: "GoronVillage"},
          {name: "Goron Shop 10 Bombs", region: "GoronVillage"},
          {name: "Goron Shop Red Potion", region: "GoronVillage"},
          {name: "Goron Trial Bonus", region: "TheMoon"},
          {name: "Goron Village Ledge", region: "GoronVillage"},
          {name: "Gossip Stones", region: "TerminaField"},
          {name: "Grandma Long Story", region: "StockPotInn"},
          {name: "Grandma Short Story",region: "StockPotInn"},
          {name: "Great Bay Bio Babas", region: "GreatBayTemple"},
          {name: "Great Bay Boss Key Chest", region: "GreatBayTemple"},
          {name: "Great Bay Coast Grotto Cow #1", region: "GreatBayCoast"},
          {name: "Great Bay Coast Grotto Cow #2", region: "GreatBayCoast"},
          {name: "Great Bay Coast Grotto", region: "GreatBayCoast"},
          {name: "Great Bay Coast Ledge", region: "GreatBayCoast"},
          {name: "Great Bay Compass Chest", region: "GreatBayTemple"},
          {name: "Great Bay Dexihands Jar", region: "GreatBayTemple"},
          {name: "Great Bay Entrance Torches",region: "GreatBayTemple"},
          {name: "Great Bay Green Valve", region: "GreatBayTemple"},
          {name: "Great Bay Ledge Jar", region: "GreatBayTemple"},
          {name: "Great Bay Map Chest", region: "GreatBayTemple"},
          {name: "Great Bay Map Purchase", region: "MilkRoad"},
          {name: "Great Bay Pre-Boss Room Bubble", region: "GreatBayTemple"},
          {name: "Great Bay Pre-Boss Room Underwater Bubble", region: "GreatBayTemple"},
          {name: "Great Bay Seesaw Room", region: "GreatBayTemple"},
          {name: "Great Bay Skulltula", region: "GreatBayTemple"},
          {name: "Great Bay Small Key Chest",region: "GreatBayTemple"},
          {name: "Great Bay Underwater Barrel", region: "GreatBayTemple"},
          {name: "Great Bay Water Control Room Underwater Bubble", region: "GreatBayTemple"},
          {name: "Great Bay Waterwheel Room Lower", region: "GreatBayTemple"},
          {name: "Great Bay Waterwheel Room Upper", region: "GreatBayTemple"},
          {name: "Great Bay Whirlpool Barrel", region: "GreatBayTemple"},
          {name: "Great Bay Whirlpool Jar", region: "GreatBayTemple"},
          {name: "Grog", region: "RomaniRanch"},
          {name: "Guru Guru", region: "LaundryPool"},
          {name: "Gyorg Heart Container", region: "GreatBayTemple"},
          {name: "Hero's Bow Chest",region: "WoodfallTemple"},
          {name: "Honey and Darling Any Day", region: "EastClockTown"},
          {name: "Honey and Darling Three Days", region: "EastClockTown"},
          {name: "Hookshot Chest", region: "PiratesFortressInterior"},
          {name: "Hot Spring Water Grotto", region: "TwinIslands"},
          {name: "Hungry Goron", region: "MountainVillage"},
          {name: "Ice Arrow Chest", region: "GreatBayTemple"},
          {name: "Ikana Canyon Ledge", region: "IkanaCanyon"},
          {name: "Ikana Castle Pillar", region: "IkanaCastle"},
          {name: "Ikana Graveyard Grotto", region: "IkanaGraveyard"},
          {name: "Ikana Great Fairy",region: "IkanaCanyon"},
          {name: "Ikana King", region: "IkanaCastle"},
          {name: "Imprisoned Monkey", region: "DekuPalace"},
          {name: "Inn Guest Room Chest", region: "StockPotInn"},
          {name: "Inn Reservation", region: "StockPotInn"},
          {name: "Inn Staff Room Chest", region: "StockPotInn"},
          {name: "Inverted Stone Tower Left Chest", region: "StoneTower"},
          {name: "Inverted Stone Tower Middle Chest", region: "StoneTower"},
          {name: "Inverted Stone Tower Right Chest", region: "StoneTower"},
          {name: "Invisible Soldier", region: "RoadToIkana"},
          {name: "Iron Knuckle Chest", region: "IkanaGraveyard"},
          {name: "Kafei",region: "LaundryPool"},
          {name: "Kamaro", region: "TerminaField"},
          {name: "Keaton Quiz", region: "NorthClockTown"},
          {name: "Kotake Mushroom Sale", region: "SouthernSwamp"},
          {name: "Kotake", region: "SouthernSwamp"},
          {name: "Koume", region: "SouthernSwamp"},
          {name: "Lab Fish", region: "GreatBayCoast"},
          {name: "Lens Cave Invisible Chest", region: "GoronVillage"},
          {name: "Lens Cave Rock Chest", region: "GoronVillage"},
          {name: "Lens of Truth Chest", region: "GoronVillage"},
          {name: "Light Arrow Chest", region: "StoneTowerTemple"},
          {name: "Link Trial Bonus",region: "TheMoon"},
          {name: "Link Trial Garo Master Chest", region: "TheMoon"},
          {name: "Link Trial Iron Knuckle Chest", region: "TheMoon"},
          {name: "Lottery", region: "WestClockTown"},
          {name: "Lulu's Room Ledge", region: "ZoraHall"},
          {name: "Madame Aroma in Bar", region: "EastClockTown"},
          {name: "Madame Aroma in Office", region: "EastClockTown"},
          {name: "Majora Child", region: "TheMoon"},
          {name: "Mayor", region: "EastClockTown"},
          {name: "Midnight Meeting", region: "StockPotInn"},
          {name: "Mikau", region: "GreatBayCoast"},
          {name: "Milk Bar Chateau", region: "EastClockTown"},
          {name: "Milk Bar Milk",region: "EastClockTown"},
          {name: "Mirror Shield Chest", region: "BeneathTheWell"},
          {name: "Mountain Scrub Trade", region: "GoronVillage"},
          {name: "Mountain Smithy Day 1", region: "MountainVillage"},
          {name: "Mountain Smithy Day 2", region: "MountainVillage"},
          {name: "Mountain Spring Grotto", region: "MountainVillage"},
          {name: "Mountain Waterfall Chest", region: "MountainVillage"},
          {name: "Mystery Woods Grotto", region: "SouthernSwamp"},
          {name: "Near Swamp Spider House Grotto", region: "SouthernSwamp"},
          {name: "North Clock Town Tree", region: "NorthClockTown"},
          {name: "Ocean Great Fairy",region: "ZoraCape"},
          {name: "Ocean Scrub Purchase", region: "ZoraHall"},
          {name: "Ocean Scrub Trade", region: "ZoraHall"},
          {name: "Ocean Skulltula 2nd Room Behind Skull 1", region: "GreatBayCoast"},
          {name: "Ocean Skulltula 2nd Room Behind Skull 2", region: "GreatBayCoast"},
          {name: "Ocean Skulltula 2nd Room Ceiling Edge", region: "GreatBayCoast"},
          {name: "Ocean Skulltula 2nd Room Ceiling Plank", region: "GreatBayCoast"},
          {name: "Ocean Skulltula 2nd Room Jar", region: "GreatBayCoast"},
          {name: "Ocean Skulltula 2nd Room Lower Pot",region: "GreatBayCoast"},
          {name: "Ocean Skulltula 2nd Room Upper Pot", region: "GreatBayCoast"},
          {name: "Ocean Skulltula 2nd Room Webbed Hole", region: "GreatBayCoast"},
          {name: "Ocean Skulltula 2nd Room Webbed Pot", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Colored Skulls Behind Picture", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Colored Skulls Ceiling Edge", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Colored Skulls Chandelier 1", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Colored Skulls Chandelier 2",region: "GreatBayCoast"},
          {name: "Ocean Skulltula Colored Skulls Chandelier 3", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Colored Skulls Pot", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Entrance Left Wall", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Entrance Right Wall", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Entrance Web", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Library Behind Bookcase 1", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Library Behind Bookcase 2", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Library Behind Picture",region: "GreatBayCoast"},
          {name: "Ocean Skulltula Library Ceiling Edge", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Library Hole Behind Cabinet", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Library Hole Behind Picture", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Library On Corner Bookshelf", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Storage Room Behind Boat", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Storage Room Behind Crate", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Storage Room Ceiling Web",region: "GreatBayCoast"},
          {name: "Ocean Skulltula Storage Room Crate", region: "GreatBayCoast"},
          {name: "Ocean Skulltula Storage Room Jar", region: "GreatBayCoast"},
          {name: "Ocean Spider House Chest", region: "GreatBayCoast"},
          {name: "Ocean Spider House Day 1 Reward", region: "GreatBayCoast"},
          {name: "Ocean Spider House Day 2 Reward", region: "GreatBayCoast"},
          {name: "Ocean Spider House Day 3 Reward", region: "GreatBayCoast"},
          {name: "Odolwa Heart Container", region: "WoodfallTemple"},
          {name: "Old Lady", region: "NorthClockTown"},
          {name: "Pamela's Father",region: "IkanaCanyon"},
          {name: "Path to Ikana Grotto", region: "RoadToIkana"},
          {name: "Path to Ikana Pillar Chest", region: "RoadToIkana"},
          {name: "Path to Snowhead Grotto", region: "PathToSnowhead"},
          {name: "Path to Snowhead Pillar", region: "PathToSnowhead"},
          {name: "Path to Swamp Grotto", region: "RoadToSouthernSwamp"},
          {name: "Path to Swamp Tree", region: "RoadToSouthernSwamp"},
          {name: "Peahat Grotto", region: "TerminaField"},
          {name: "Pictograph Contest Good Photo", region: "SouthernSwamp"},
          {name: "Pictograph Contest Standard Photo",region: "SouthernSwamp"},
          {name: "Pictograph Contest Winner", region: "SouthernSwamp"},
          {name: "Pinnacle Rock Lower Chest", region: "PinnacleRock"},
          {name: "Pinnacle Rock Upper Chest", region: "PinnacleRock"},
          {name: "Pirates' Fortress Cage Room Deep Chest", region: "PiratesFortressSewer"},
          {name: "Pirates' Fortress Cage Room Shallow Chest", region: "PiratesFortressSewer"},
          {name: "Pirates' Fortress Cage", region: "PiratesFortressSewer"},
          {name: "Pirates' Fortress Exterior Corner Chest", region: "PiratesFortressExterior"},
          {name: "Pirates' Fortress Exterior Log Chest",region: "PiratesFortressExterior"},
          {name: "Pirates' Fortress Exterior Sand Chest", region: "PiratesFortressExterior"},
          {name: "Pirates' Fortress Interior Guard Room Chest", region: "PiratesFortressInterior"},
          {name: "Pirates' Fortress Interior Lower Chest", region: "PiratesFortressInterior"},
          {name: "Pirates' Fortress Interior Tank Chest", region: "PiratesFortressInterior"},
          {name: "Pirates' Fortress Interior Upper Chest", region: "PiratesFortressInterior"},
          {name: "Pirates' Fortress Maze Chest", region: "PiratesFortressSewer"},
          {name: "Poe Hut", region: "IkanaCanyon"},
          {name: "Postbox",region: "SouthClockTown"},
          {name: "Postman's Freedom Reward", region: "EastClockTown"},
          {name: "Postman's Game", region: "WestClockTown"},
          {name: "Powder Keg Challenge", region: "GoronVillage"},
          {name: "Pre-Clocktown Chest", region: "BeneathClocktown"},
          {name: "Ranch Cow #1", region: "RomaniRanch"},
          {name: "Ranch Cow #2", region: "RomaniRanch"},
          {name: "Ranch Cow #3", region: "RomaniRanch"},
          {name: "Romani Ranch Map Purchase", region: "MilkRoad"},
          {name: "Romani's Game", region: "RomaniRanch"},
          {name: "Rosa Sisters", region: "WestClockTown"},
          {name: "Seahorses",region: "PinnacleRock"},
          {name: "Secret Shrine Dinolfos Chest", region: "SecretShrine"},
          {name: "Secret Shrine Final Chest", region: "SecretShrine"},
          {name: "Secret Shrine Garo Master Chest", region: "SecretShrine"},
          {name: "Secret Shrine Grotto", region: "IkanaCanyon"},
          {name: "Secret Shrine Wart Chest", region: "SecretShrine"},
          {name: "Secret Shrine Wizzrobe Chest", region: "SecretShrine"},
          {name: "Snowhead Basement", region: "SnowheadTemple"},
          {name: "Snowhead Block Room Chest", region: "SnowheadTemple"},
          {name: "Snowhead Boss Key Chest",region: "SnowheadTemple"},
          {name: "Snowhead Bridge Room Chest", region: "SnowheadTemple"},
          {name: "Snowhead Bridge Room Ledge Bubble", region: "SnowheadTemple"},
          {name: "Snowhead Bridge Room Pillar Bubble", region: "SnowheadTemple"},
          {name: "Snowhead Ceiling Bubble", region: "SnowheadTemple"},
          {name: "Snowhead Compass Chest", region: "SnowheadTemple"},
          {name: "Snowhead Crate", region: "SnowheadTemple"},
          {name: "Snowhead Dinolfos 1", region: "SnowheadTemple"},
          {name: "Snowhead Dinolfos 2", region: "SnowheadTemple"},
          {name: "Snowhead Great Fairy", region: "Snowhead"},
          {name: "Snowhead Ice Puzzle",region: "SnowheadTemple"},
          {name: "Snowhead Icicle Room Chest", region: "SnowheadTemple"},
          {name: "Snowhead Icicle Room Wall", region: "SnowheadTemple"},
          {name: "Snowhead Main Room Wall", region: "SnowheadTemple"},
          {name: "Snowhead Map Chest", region: "SnowheadTemple"},
          {name: "Snowhead Map Purchase", region: "RoadToSouthernSwamp"},
          {name: "Snowhead Map Room Fairy", region: "SnowheadTemple"},
          {name: "Snowhead Map Room Ledge", region: "SnowheadTemple"},
          {name: "Snowhead Pillar Freezards", region: "SnowheadTemple"},
          {name: "Snowhead Snow Room Bubble",region: "SnowheadTemple"},
          {name: "Snowhead Twin Block", region: "SnowheadTemple"},
          {name: "South Clock Town Final Day Chest", region: "SouthClockTown"},
          {name: "South Clock Town Straw Roof Chest", region: "SouthClockTown"},
          {name: "Starting Heart Container #1", region: "Misc"},
          {name: "Starting Heart Container #2", region: "Misc"},
          {name: "Starting Item", region: "Misc"},
          {name: "Starting Shield", region: "Misc"},
          {name: "Starting Song", region: "Misc"},
          {name: "Starting Sword", region: "Misc"},
          {name: "Stone Tower Armor Room Chest", region: "StoneTowerTemple"},
          {name: "Stone Tower Basement Ledge",region: "StoneTowerTemple"},
          {name: "Stone Tower Boss Key Chest", region: "StoneTowerTemple"},
          {name: "Stone Tower Boss Warp", region: "StoneTowerTemple"},
          {name: "Stone Tower Bridge Crystal", region: "StoneTowerTemple"},
          {name: "Stone Tower Compass Chest", region: "StoneTowerTemple"},
          {name: "Stone Tower Death Armos Maze Chest", region: "StoneTowerTemple"},
          {name: "Stone Tower Death Armos", region: "StoneTowerTemple"},
          {name: "Stone Tower Eyegore Room Chest", region: "StoneTowerTemple"},
          {name: "Stone Tower Eyegore", region: "StoneTowerTemple"},
          {name: "Stone Tower Lava Room Fire Ring",region: "StoneTowerTemple"},
          {name: "Stone Tower Lava Room Ledge", region: "StoneTowerTemple"},
          {name: "Stone Tower Map Chest", region: "StoneTowerTemple"},
          {name: "Stone Tower Map Purchase", region: "GreatBayCoast"},
          {name: "Stone Tower Mirror Sun Block", region: "StoneTowerTemple"},
          {name: "Stone Tower Mirror Sun Switch", region: "StoneTowerTemple"},
          {name: "Stone Tower Statue Eye", region: "StoneTowerTemple"},
          {name: "Stone Tower Thin Bridge", region: "StoneTowerTemple"},
          {name: "Stone Tower Underwater", region: "StoneTowerTemple"},
          {name: "Stone Tower Updraft Fire Ring",region: "StoneTowerTemple"},
          {name: "Stone Tower Updraft Frozen Eye", region: "StoneTowerTemple"},
          {name: "Stone Tower Updraft Room Chest", region: "StoneTowerTemple"},
          {name: "Stone Tower Wizzrobe", region: "StoneTowerTemple"},
          {name: "Swamp Archery #1", region: "RoadToSouthernSwamp"},
          {name: "Swamp Archery #2", region: "RoadToSouthernSwamp"},
          {name: "Swamp Music Statue", region: "SouthernSwamp"},
          {name: "Swamp Scrub Purchase", region: "SouthernSwamp"},
          {name: "Swamp Scrub Trade", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Gold Room Hive",region: "SouthernSwamp"},
          {name: "Swamp Skulltula Gold Room Near Ceiling", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Gold Room Pillar", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Gold Room Wall", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Main Room Jar", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Main Room Lower Left Soft Soil", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Main Room Lower Right Soft Soil", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Main Room Near Ceiling", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Main Room Pillar",region: "SouthernSwamp"},
          {name: "Swamp Skulltula Main Room Upper Pillar", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Main Room Upper Soft Soil", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Main Room Water", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Monument Room Crate 1", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Monument Room Crate 2", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Monument Room Lower Wall", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Monument Room On Monument", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Monument Room Torch",region: "SouthernSwamp"},
          {name: "Swamp Skulltula Pot Room Behind Vines", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Pot Room Hive 1", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Pot Room Hive 2", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Pot Room Jar", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Pot Room Pot 1", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Pot Room Pot 2", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Pot Room Wall", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Tree Room Grass 1", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Tree Room Grass 2", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Tree Room Hive", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Tree Room Tree 1", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Tree Room Tree 2", region: "SouthernSwamp"},
          {name: "Swamp Skulltula Tree Room Tree 3", region: "SouthernSwamp"},
          {name: "Swamp Spider House Reward", region: "SouthernSwamp"},
          {name: "Swamp Tourist Center Roof", region: "SouthernSwamp"},
          {name: "Swordsman's School", region: "WestClockTown"},
          {name: "Termina Field Grass Chest",region: "TerminaField"},
          {name: "Termina Field Grass Grotto", region: "TerminaField"},
          {name: "Termina Field Pillar Grotto", region: "TerminaField"},
          {name: "Termina Field Stump Chest", region: "TerminaField"},
          {name: "Termina Field Underwater Chest", region: "TerminaField"},
          {name: "Termina Grotto Cow #1", region: "TerminaField"},
          {name: "Termina Grotto Cow #2", region: "TerminaField"},
          {name: "Toilet Hand", region: "StockPotInn"},
          {name: "Town Archery #1", region: "EastClockTown"},
          {name: "Town Archery #2", region: "EastClockTown"},
          {name: "Town Great Fairy Non-Human",region: "NorthClockTown"},
          {name: "Town Great Fairy", region: "NorthClockTown"},
          {name: "Trading Post 10 Deku Nuts", region: "WestClockTown"},
          {name: "Trading Post 30 Arrows", region: "WestClockTown"},
          {name: "Trading Post 50 Arrows", region: "WestClockTown"},
          {name: "Trading Post Deku Stick", region: "WestClockTown"},
          {name: "Trading Post Fairy", region: "WestClockTown"},
          {name: "Trading Post Green Potion", region: "WestClockTown"},
          {name: "Trading Post Hero's Shield", region: "WestClockTown"},
          {name: "Trading Post Red Potion", region: "WestClockTown"},
          {name: "Treasure Chest Game Deku",region: "EastClockTown"},
          {name: "Treasure Chest Game Goron", region: "EastClockTown"},
          {name: "Treasure Chest Game Human", region: "EastClockTown"},
          {name: "Treasure Chest Game Zora", region: "EastClockTown"},
          {name: "Twin Islands Cave Chest", region: "TwinIslands"},
          {name: "Twin Islands Underwater Ramp Chest", region: "TwinIslands"},
          {name: "Twinmold Heart Container", region: "StoneTowerTemple"},
          {name: "Well Left Path Chest", region: "BeneathTheWell"},
          {name: "Well Right Path Chest", region: "BeneathTheWell"},
          {name: "Witch Shop Blue Potion",region: "SouthernSwamp"},
          {name: "Witch Shop Green Potion", region: "SouthernSwamp"},
          {name: "Witch Shop Red Potion", region: "SouthernSwamp"},
          {name: "Woodfall Boss Key Chest", region: "WoodfallTemple"},
          {name: "Woodfall Bridge Chest", region: "Woodfall"},
          {name: "Woodfall Bridge Room Hive", region: "WoodfallTemple"},
          {name: "Woodfall Compass Chest", region: "WoodfallTemple"},
          {name: "Woodfall Dark Room", region: "WoodfallTemple"},
          {name: "Woodfall Deku Baba", region: "WoodfallTemple"},
          {name: "Woodfall Entrance Fairy", region: "WoodfallTemple"},
          {name: "Woodfall Entrance Platform",region: "WoodfallTemple"},
          {name: "Woodfall Great Fairy", region: "Woodfall"},
          {name: "Woodfall Jar Fairy", region: "WoodfallTemple"},
          {name: "Woodfall Main Room Bubble", region: "WoodfallTemple"},
          {name: "Woodfall Main Room Switch", region: "WoodfallTemple"},
          {name: "Woodfall Map Chest", region: "WoodfallTemple"},
          {name: "Woodfall Map Purchase", region: "RoadToSouthernSwamp"},
          {name: "Woodfall Platform Room Hive", region: "WoodfallTemple"},
          {name: "Woodfall Poison Water Bubble", region: "WoodfallTemple"},
          {name: "Woodfall Pre-Boss Lower Right Bubble", region: "WoodfallTemple"},
          {name: "Woodfall Pre-Boss Pillar Bubble", region: "WoodfallTemple"},
          {name: "Woodfall Pre-Boss Upper Left Bubble", region: "WoodfallTemple"},
          {name: "Woodfall Pre-Boss Upper Right Bubble", region: "WoodfallTemple"},
          {name: "Woodfall Skulltula", region: "WoodfallTemple"},
          {name: "Woodfall Small Key Chest", region: "WoodfallTemple"},
          {name: "Zora Cape Grotto", region: "ZoraCape"},
          {name: "Zora Cape Ledge With Tree Chest", region: "ZoraCape"},
          {name: "Zora Cape Ledge Without Tree Chest", region: "ZoraCape"},
          {name: "Zora Cape Like-Like", region: "ZoraCape"},
          {name: "Zora Cape Underwater Chest", region: "ZoraCape"},
          {name: "Zora Hall Stage Lights", region: "ZoraHall"},
          {name: "Zora Shop 10 Arrows", region: "ZoraHall"},
          {name: "Zora Shop Hero's Shield", region: "ZoraHall"},
          {name: "Zora Shop Red Potion", region: "ZoraHall"},
          {name: "Zora Trial Bonus", region: "TheMoon"}
        ],
        regions: ["BeneathClocktown", "BeneathTheWell", "BottleCatch", "DekuPalace", "EastClockTown", "GoronVillage", "GreatBayCoast", "GreatBayTemple", "IkanaCanyon", "IkanaCastle", "IkanaGraveyard", "LaundryPool", "MilkRoad", "MountainVillage", "NorthClockTown", "PathToSnowhead", "PinnacleRock", "PiratesFortressExterior", "PiratesFortressInterior", "PiratesFortressSewer", "RoadToIkana", "RoadToSouthernSwamp", "RomaniRanch", "SecretShrine", "Snowhead", "SnowheadTemple", "SouthClockTown", "SouthernSwamp", "StockPotInn", "StoneTower", "StoneTowerTemple", "TerminaField", "TheMoon", "TwinIslands", "WestClockTown", "Woodfall", "WoodfallTemple", "ZoraCape", "ZoraHall"],
        selectedWayOfHero: [],
        selectedFoolish: [],
        showNotification: false,
        message: null,
        regionHints: {},
        showResetModal: false,
      };
    },
    computed:{
      sortedWayOfTheHero() {
        let data = JSON.parse(JSON.stringify(this.selectedWayOfHero));
        data.sort((a, b) => {
          return a > b ? 1 : -1;
        });
        return data;
      },
      sortedFoolish() {
        let data = JSON.parse(JSON.stringify(this.selectedFoolish));
        data.sort((a, b) => {
          return a > b ? 1 : -1;
        });
        return data;
      },
    },
    watch:{
      selectedFoolish() {
        localStorage.selectedFoolish = JSON.stringify(this.selectedFoolish);
      },
      selectedWayOfHero() {
        localStorage.selectedWayOfHero = JSON.stringify(this.selectedWayOfHero);
      },
    },
    created() {
      let hints = JSON.parse(localStorage.getItem("regionHints"));
      if (hints) {
        this.regionHints = hints;
      }
      let wayOfTheHeroLocations = JSON.parse(localStorage.getItem("selectedWayOfHero"));
      if (wayOfTheHeroLocations) {
        this.selectedWayOfHero = wayOfTheHeroLocations;
      }
      let foolishLocations = JSON.parse(localStorage.getItem("selectedFoolish"));
      if (foolishLocations) {
        this.selectedFoolish = foolishLocations;
      }
    },
    // mounted() {
    //   this.regionHints = {};
    //   this.items.forEach(item => {
    //     this.selectedItem = item;
    //     this.selectedLocation = this.locations[Math.floor(Math.random() * this.locations.length)];
    //     this.addHint();
    //   });
    // },
    methods: {
      isWOTH(region){
        if(this.selectedWayOfHero.includes(region)){
          return true;
        }
        return false;
      },
      isFoolish(region){
        if(this.selectedFoolish.includes(region)){
          return true;
        }
        return false;
      },
      toggleWoth(location, flag) {
        if (flag === true) {
          //selectedWayOfHero true remove it from selectedFoolish
          this.selectedFoolish = this.selectedFoolish.filter(foolishLocation => {
            if (foolishLocation !== location) {
              return foolishLocation;
            }
          });
        }
        if (flag === false) {
          //selectedFoolish remove it from selectedWayOfHero
          this.selectedWayOfHero = this.selectedWayOfHero.filter(wothLocation => {
            if (wothLocation !== location) {
              return wothLocation;
            }
          });
        }
      },
      sortObject(unordered, sortArrays = false) {
        if (!unordered || typeof unordered !== "object") {
          return unordered;
        }

        if (Array.isArray(unordered)) {
          const newArr = unordered.map((item) => this.sortObject(item, sortArrays));
          if (sortArrays) {
            newArr.sort();
          }
          return newArr;
        }

        const ordered = {};
        Object.keys(unordered).sort().forEach((key) => {
          ordered[key] = this.sortObject(unordered[key], sortArrays);
        });
        return ordered;
      },
      assembleImagePath(imageName) {
        return "/images/" + imageName;
      },
      handleLocationSelect(location) {
        if (Object.entries(location).length === 0) {
          this.selectedLocation = {};
          return;
        }
        this.selectedLocation = location;
      },
      handleItemSelect(item) {
        if (!item) {
          this.selectedItem = {};
          return;
        }
        this.selectedItem = item;
      },
      handleNotificationClose() {
        this.showNotification = false;
        this.message = null;
        this.timeOutId = null;
      },
      addHint() {
        if (!this.regionHints[this.selectedLocation.region]) {
          this.regionHints[this.selectedLocation.region] = [{
            locationName: this.selectedLocation.name,
            item: this.selectedItem.name,
            image: this.selectedItem.image,
            id: Math.random().toString(36).substring(2) + Date.now().toString(36),
          }];
        } else {
          this.regionHints[this.selectedLocation.region].push({
            locationName: this.selectedLocation.name,
            item: this.selectedItem.name,
            image: this.selectedItem.image,
            id: Math.random().toString(36).substring(2) + Date.now().toString(36),
          });
        }

        this.regionHints[this.selectedLocation.region].sort((a, b) => {
          if (a.locationName < b.locationName) {
            return -1;
          }
          if (a.locationName > b.locationName) {
            return 1;
          }
          return 0;
        });

        this.showNotification = true;
        this.message = `Added New Hint. ${this.selectedLocation.name} is ${this.selectedItem.name}.`;
        if (this.timeOutId !== null) {
          clearTimeout(this.timeOutId);
          this.timeOutId = null;
        }
        this.timeOutId = setTimeout(() => {
          this.showNotification = false;
          this.message = null;
        }, 3000);

        this.regionHints = this.sortObject(this.regionHints);

        this.selectedLocation = {};
        this.selectedItem = {};
        localStorage.setItem("regionHints", JSON.stringify(this.regionHints));
      },
      removeHint(region, hint) {
        for (let i in this.regionHints[region]) {
          if (Object.prototype.hasOwnProperty.call(this.regionHints[region], i) && this.regionHints[region][i].id === hint.id) {
            this.regionHints[region].splice(i, 1);
          }
        }
        if (this.regionHints[region].length === 0) {
          delete this.regionHints[region];
        }
        this.regionHints = JSON.parse(JSON.stringify(this.regionHints));
        localStorage.setItem("regionHints", JSON.stringify(this.regionHints));
      },
      splitRegionName(region) {
        return region.split(/(?=[A-Z])/).join(" ");
      },
      resetRegionHints() {
        this.regionHints = {};
        this.selectedWayOfHero = [];
        this.selectedFoolish = [];
        localStorage.clear();
        this.showResetModal = false;
      },
    },
  };
</script>

<style scoped>
</style>
