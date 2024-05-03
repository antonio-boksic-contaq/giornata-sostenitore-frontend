<template>
  <div class="py-6">
    <errors />
    <form
      enctype="multipart/form-data"
      :method="formStore.method"
      :id="formStore.id + 'Reservation'"
      @submit.prevent="submit">
      <transition name="fade">
        <div
          v-if="state.locations === null || state.date === null"
          class="warning">
          {{ warningMessage }}
        </div>
      </transition>
      <div class="mt-0">
        <!-- <transition name="fade">
          <div
            v-if="state.date === null && state.locations !== null"
            class="warning">
            Per poter selezionare un orario è necessario prima selezionare una
            data
          </div>
        </transition> -->

        <!-- sedi -->

        <label for="location" class="font-medium block mb-2"> Sede </label>
        <vue-select
          :value="state.locations"
          label="centro"
          :options="locations"
          :multiple="false"
          @selectedValueChange="changeData($event, 'locations')"
          field="locations"></vue-select>
        <validation-error :vuelidate="v$.locations" />

        <!-- date -->
        <div v-if="state.locations != null">
          <label for="date" class="font-medium block mb-2"> Data </label>
          <vue-select
            :value="state.date"
            label="data"
            :options="dates"
            :multiple="false"
            @selectedValueChange="changeData($event, 'date')"
            field="date"></vue-select>
          <!-- <validation-error :vuelidate="v$.data" /> -->
        </div>

        <!-- ore -->
        <div v-if="state.date != null">
          <label for="hours" class="font-medium block mb-2"> Orario </label>
          <vue-select
            :value="state.hours"
            label="ora"
            :options="hours"
            :multiple="false"
            @selectedValueChange="changeData($event, 'hours')"
            field="hours"></vue-select>
          <!-- <validation-error :vuelidate="v$.hours" /> -->
        </div>

        <!-- codice sostenitore -->
        <label for="codiceSostenitore" class="font-medium block mb-2">
          Codice sostenitore
        </label>
        <InputText
          type="text"
          id="codiceSostenitore"
          name="codiceSostenitore"
          placeholder="Inserire il codice sostenitore"
          v-model="state.codiceSostenitore"
          class="w-full" />
        <validation-error :vuelidate="v$.codiceSostenitore" />

        <!-- codice sostenitore -->
        <label for="cognome" class="font-medium block mb-2"> Cognome </label>
        <InputText
          type="text"
          id="cognome"
          name="cognome"
          placeholder="Inserire il cognome del sostenitore"
          v-model="state.cognome"
          class="w-full" />

        <!-- codice sostenitore -->
        <label for="nome" class="font-medium block mb-2"> Nome </label>
        <InputText
          type="text"
          id="nome"
          name="nome"
          placeholder="Inserire il nome del sostenitore"
          v-model="state.nome"
          class="w-full" />

        <!-- persone -->
        <label for="persone" class="font-medium block mb-2">
          Numero partecipanti
        </label>
        <InputText
          type="number"
          id="persone"
          name="persone"
          placeholder="Inserire numero partecipanti"
          v-model="state.persone"
          class="w-full" />
        <validation-error :vuelidate="v$.persone" />

        <!-- <button @click="showStateLocation">consolelog state</button> -->

        <!--TODO AGGIUNGERE VALIDAZIONE? LASCIO QUESTA COME ESEMPIO -->
        <!-- description -->
        <!-- <label for="description" class="font-medium block mb-2">
          Descrizione
        </label>
        <InputText
          type="text"
          id="description"
          name="description"
          placeholder="Inserire la descrizione (opzionale)"
          v-model="state.description"
          class="w-full" />
        <validation-error :vuelidate="v$.description" /> -->
      </div>

      <!-- bottone salva -->
      <div class="clear-both mt-14">
        <Button
          label="Salva"
          class="p-button-text font-semibold block w-full mt-4 mx-auto uppercase text-3xl"
          :class="'p-button-' + formStore.color"
          @click="submit">
          <i class="pi pi-save mr-2 text-3xl"></i>
          Salva
        </Button>
      </div>
    </form>
  </div>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { reactive, ref, onBeforeMount, computed } from "vue";
import { useApiStore } from "@/store/api";
import { useFormStore } from "@/store/forms";
import Errors from "@/components/shared/Errors.vue";
import ValidationError from "@/components/shared/ValidationError";
import VueSelect from "@/components/shared/VueSelect";

export default {
  name: "ReservationForm",
  components: { Errors, VueSelect, ValidationError },
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  setup(props, context) {
    const apiStore = useApiStore();
    const formStore = useFormStore();
    const urlLocations = process.env.VUE_APP_API_URL + "/fetchCentro";

    const locations = ref([]);
    const dates = [
      { id: 1, data: "Venerdì 24 maggio " },
      { id: 2, data: "Sabato 25 maggio " },
    ];
    const hours = ref([]);

    const showStateLocation = () => {
      console.log(state);
    };

    onBeforeMount(async () => {
      apiStore.isLoading = true;
      const response = await apiStore.fetch(urlLocations);
      locations.value = response;
      apiStore.isLoading = false;
    });

    const state = reactive({
      // se mai bisognerà implementare funzionalità di modifica si può utilizzare uno state del genere
      // description: formStore.data != null ? formStore.data.description : null,
      // name: formStore.data != null ? formStore.data.name : null,
      locations: null,
      date: null,
      hours: null,
      codiceSostenitore: null,
      persone: null,
      cognome: null,
      nome: null,
    });

    // da capire meglio tutto il discorso Vuelidate
    const rules = {
      persone: {
        required: helpers.withMessage("Questo campo è obbligatorio", required),
      },
      codiceSostenitore: {
        required: helpers.withMessage("Questo campo è obbligatorio", required),
      },
      // hours: {
      //   required: helpers.withMessage("Questo campo è obbligatorio", required),
      // },
      // date: {
      //   required: helpers.withMessage("Questo campo è obbligatorio", required),
      // },
      locations: {
        required: helpers.withMessage("Questo campo è obbligatorio", required),
      },
    };

    const v$ = useVuelidate(rules, state);

    // proviamo a capire cosa succede sul submit
    const submit = async () => {
      // const validate = await v$.value.$validate();
      // if (!validate) return;
      //se validazione è avvenuta con successo possiamo procedere da qui
      //noi siamo dentro a questo if in fase di creazione
      if (formStore.action === "store") {
        console.log("VEDERE DA QUI");
        console.log("route", formStore.route);
        console.log(formStore.id + "Reservation");
        // route http://localhost:8081/api/reservations
        // frmAddReservation
        await apiStore.store(formStore.route, formStore.id + "Reservation");
      }

      if (formStore.action === "update")
        await apiStore.update(formStore.route, formStore.id + "Reservation");

      if (apiStore.success === true) {
        context.emit("emptyTable", true);
        apiStore.isLoading = true;
        const response = await apiStore.fetch(props.url, apiStore.params);
        context.emit("fetchData", response);
        formStore.empty();
      }
    };

    // viene chiamata da emit di VueSelect
    const changeData = async (event, field) => {
      state[field] = event;
      if (field === "locations") {
        state.date = null;
      }
      if (field === "date" && state.date != null) {
        state.hours = null; // quando cambio data riazzero le ore e alla fine le ripopolo

        // trovo la data da mettere nell'url
        // const selectedDateId = state.date; // state.date è l'id nell'oggetto della data selezionata
        // const selectedDate = dates.find((date) => date.id === selectedDateId); // trovo l'intero oggetto della data selezionata
        // const selectedDateString = selectedDate ? selectedDate.data : null; // mi prendo la proprietà che mi interessa
        // console.log("selectedDateString", selectedDateString);
        // TUTTO QUESTO GIRO NON MI SERVE PIù DATO CHE HO DIRETTAMENTE IL VALORE CHE MI INTERESSA NELLO STATE
        //NON DEVO PIù PARTIRE DALL ID

        // trovo la location da mettere nell'url
        // const selectedLocationId = state.locations; // state.locations è l'id nell'oggetto della location selezionata
        // const selectedLocation = locations.value.find(
        //   (location) => location.id === selectedLocationId
        // ); // trovo l'intero oggetto della location selezionata

        // const selectedLocationString = selectedLocation
        //   ? selectedLocation.centro
        //   : null; // mi prendo la proprietà che mi interessa

        let urlHours =
          process.env.VUE_APP_API_URL +
          "/fetchOre" +
          "?" +
          "centroGDS=" +
          state.locations +
          "&data=" +
          state.date;
        console.log("urlhours", urlHours);

        //far partire chiamata e popolare hours
        const response = await apiStore.fetch(urlHours);
        //console.log(response);
        hours.value = response;
        console.log(hours.value);
      }
    };

    const warningMessage = computed(() => {
      if (state.locations === null) {
        return "Per poter selezionare una data è necessario prima selezionare una sede";
      } else if (state.date === null && state.locations !== null) {
        return "Per poter selezionare un orario è necessario prima selezionare una data";
      } else {
        return "";
      }
    });

    return {
      formStore,
      submit,
      state,
      v$,
      locations,
      changeData,
      showStateLocation,
      dates,
      hours,
      warningMessage,
    };
  },
};
</script>

<style>
.warning {
  background-color: orange;
  padding: 4px; /* Aggiunge spazio interno */
  border-radius: 5px; /* Aggiunge bordi arrotondati */
  width: fit-content; /* Larghezza che si adatta al contenuto */
  margin-bottom: 10px; /* Aggiunge spazio sotto l'elemento */
}
</style>
