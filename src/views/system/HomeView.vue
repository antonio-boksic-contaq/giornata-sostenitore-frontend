<template>
  <default-page :icon="['fas', 'list-check']">
    <!-- <template #title>Task</template>
    <template #subtitle>
      La lista dei task da poter associare ad uno startup.
    </template> -->
    <template #content>
      <div class="card filters">
        <standard-action
          itemText="prenotazione"
          item="reservation"
          :url="url"
          @fetchData="fetchData($event)"
          @emptyTable="emptyRows"></standard-action>
        <!-- SELECT FILTERS -->
        <div class="ml-0 mt-7 grid grid-cols-1 md:grid-cols-12 gap-7">
          <div class="md:col-start-1 md:col-end-4">
            <select-filter
              label="Giorno"
              text="data"
              :url="url"
              :options="dates"
              field="data"
              @emptyTable="emptyRows"
              @fetchData="fetchData($event)" />
          </div>
          <div class="md:col-start-4 md:col-end-7">
            <select-filter
              label="Centro"
              text="centro"
              :multiple="false"
              :url="url"
              :options="locations"
              :combo="false"
              field="centro"
              @emptyTable="emptyRows"
              @fetchData="fetchData($event)" />
          </div>
          <div class="md:col-start-7 md:col-end-10">
            <select-filter
              label="Turno"
              text="turno"
              :multiple="false"
              :url="url"
              :options="shifts"
              :combo="false"
              field="turno"
              @emptyTable="emptyRows"
              @fetchData="fetchData($event)" />
          </div>
        </div>
      </div>

      <div>Ultimo aggiornamento: {{ getCurrentDateTime() }}</div>

      <grouped-reservation-table
        :rows="rows"
        :url="url"
        @fetchData="fetchData($event)"
        @emptyTable="emptyRows" />

      <grouped-reservation-modal
        :url="url"
        @fetchData="fetchData($event)"
        @emptyTable="emptyRows" />
    </template>
  </default-page>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import { useApiStore } from "@/store/api";
import DefaultPage from "@/components/layouts/DefaultPage.vue";
import StandardAction from "@/components/actions/StandardAction.vue";
import GroupedReservationTable from "@/components/tables/GroupedReservationTable.vue";
import GroupedReservationModal from "@/components/modals/GroupedReservationModal.vue";
import SelectFilter from "@/components/actions/SelectFilter.vue";

export default {
  name: "HomeView",
  components: {
    DefaultPage,
    StandardAction,
    GroupedReservationTable,
    GroupedReservationModal,
    SelectFilter,
  },
  setup() {
    const apiStore = useApiStore();
    const url = process.env.VUE_APP_API_URL + "/reservations";
    const urlLocations = process.env.VUE_APP_API_URL + "/fetchCentro";
    const rows = ref([]);
    const locations = ref([]);
    const dates = [
      { id: 1, data: "Venerdì 24 maggio " },
      { id: 2, data: "Sabato 25 maggio " },
    ];
    const shifts = [
      { id: 1, turno: "Mattina" },
      { id: 2, turno: "Pomeriggio" },
    ];

    onBeforeMount(async () => {
      apiStore.isLoading = true;
      const response = await apiStore.fetch(url);
      rows.value = response;
      const locationsResponse = await apiStore.fetch(urlLocations);
      locations.value = locationsResponse;
      console.log(locations.value);
      apiStore.isLoading = false;
    });

    const emptyRows = () => {
      rows.value = [];
    };

    const fetchData = (event) => {
      rows.value = event;
      apiStore.isLoading = false;
    };

    const getCurrentDateTime = () => {
      const now = new Date();
      const formattedDate = `${now.getDate()}/${
        now.getMonth() + 1
      }/${now.getFullYear()}`;

      // Formattazione dell'ora e dei minuti con due cifre
      const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

      const formattedDateTime = `${formattedDate} alle ${formattedTime}`;
      return formattedDateTime;
    };

    return {
      emptyRows,
      fetchData,
      rows,
      url,
      urlLocations,
      getCurrentDateTime,
      locations,
      dates,
      shifts,
    };
  },
};
</script>
