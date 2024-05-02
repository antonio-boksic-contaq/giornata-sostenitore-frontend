<template>
  <vue-good-table
    :columns="columns"
    :rows="rows"
    :fixed-header="true"
    max-height="60rem"
    totalRecords
    :pagination-options="paginationOptions"
    :search-options="searchOptions"
    styleClass="vgt-table condensed">
    <template #emptystate>
      <div class="text-center text-4xl"><span v-html="emptyState"></span></div>
    </template>
    <!-- vedere da qua in poi -->
    <template #table-column="props">
      <span
        v-if="props.column.field === 'actionsColumn'"
        v-tooltip.top="'Azioni'"
        class="text-center block">
        <i class="pi pi-th-large text-2xl"></i>
      </span>
    </template>
    <template #table-row="props">
      <span v-if="props.column.field === 'actionsColumn'">
        <!-- non mi serve passare field come props a action-column se passo itemText -->
        <action-column
          :props="props"
          :url="url"
          :actions="actions"
          item="grouped reservations"
          :itemText="
            'Prenotazioni - ' +
            props.row.data +
            ' / ' +
            props.row.centro +
            ' / ' +
            props.row.fasciaGiorno
          " />
      </span>
      <span v-if="props.column.field === 'totaleGDS'">
        {{ Number(props.row.totaleGDS) + " / " + max_partecipanti }}
      </span>
    </template>
  </vue-good-table>
  <!-- <Confirm @fetchData="fetchData($event)" @emptyTable="emptyTable" /> -->
</template>
<script>
import { VueGoodTable } from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";
import { ref } from "vue";
// import Confirm from "@/components/shared/Confirm";
import ActionColumn from "@/components/shared/ActionColumn";
import { useApiStore } from "@/store/api";
import { useConfirmStore } from "@/store/confirms";
import { emptyState, searchOptions, paginationOptions } from "@/utils/tables";

export default {
  name: "HourlyReservationTable",
  components: {
    ActionColumn,
    VueGoodTable,
    // Confirm,
  },
  props: ["rows", "url", "max_partecipanti"],
  emits: ["emptyTable", "fetchData"],
  setup(props, context) {
    const apiStore = useApiStore();
    const confirmStore = useConfirmStore();
    const actions = ["detail-modal"];

    const emptyTable = () => {
      context.emit("emptyTable", true);
    };

    const fetchData = (event) => {
      context.emit("fetchData", event);
    };

    const columns = ref([
      {
        label: "Ora",
        field: "oraGDS",
        tdClass: "text-center",
        thClass: "text-center",
        sortable: false,
      },

      {
        label: "Prenotazioni",
        field: "totaleGDS",
        tdClass: "text-center",
        thClass: "text-center",
        sortable: false,
      },

      // {
      //   label: "Azioni",
      //   field: "actionsColumn",
      //   width: "12rem",
      //   tdClass: "text-center",
      //   sortable: false,
      // },
    ]);

    return {
      actions,
      apiStore,
      columns,
      confirmStore,
      emptyState,
      emptyTable,
      fetchData,
      paginationOptions,
      searchOptions,
    };
  },
};
</script>
