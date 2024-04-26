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
      </div>

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

export default {
  name: "HomeView",
  components: {
    DefaultPage,
    StandardAction,
    GroupedReservationTable,
    GroupedReservationModal,
  },
  setup() {
    const apiStore = useApiStore();
    const url = process.env.VUE_APP_API_URL + "/reservations";
    const rows = ref([]);
    onBeforeMount(async () => {
      apiStore.isLoading = true;
      console.log("prima della chiamata");
      const response = await apiStore.fetch(url);
      console.log(response);
      rows.value = response;
      apiStore.isLoading = false;
    });

    const emptyRows = () => {
      rows.value = [];
    };

    const fetchData = (event) => {
      rows.value = event;
      apiStore.isLoading = false;
    };

    return { emptyRows, fetchData, rows, url };
  },
};
</script>
