<template>
  <div class="py-6">
    <!-- {{ state }} -->
    <form
      enctype="multipart/form-data"
      :method="formStore.method"
      :id="formStore.id + 'Reservation'"
      @submit.prevent="submit">
      <transition name="fade">
        <div
          v-if="
            (state.codiceSostenitore === null ||
              state.codiceSostenitore === '') &&
            (state.nome === null ||
              state.nome === '' ||
              state.cognome === null ||
              state.cognome === '')
          "
          class="warning">
          "E' necessario inserire o <strong>codice sostenitore</strong> o
          <strong>nome e cognome</strong> del sostenitore"
        </div>
      </transition>

      <div class="mt-0">
        <!-- QUANDO BISOGNA INSERIRE INPUT -->
        <div v-if="!infoOfReservation">
          <!-- codice sostenitore -->
          <div v-if="!state.nome && !state.cognome">
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
            <validation-error :vuelidate="v$.validCombination" />
          </div>

          <!-- nome -->
          <div v-if="!state.codiceSostenitore">
            <label for="nome" class="font-medium block mb-2"> Nome </label>
            <InputText
              type="text"
              id="nome"
              name="nome"
              placeholder="Inserire il nome del sostenitore"
              v-model="state.nome"
              class="w-full" />
          </div>

          <!-- <validation-error :vuelidate="v$.validCombination" /> -->
          <!-- cognome -->
          <div v-if="!state.codiceSostenitore">
            <label for="cognome" class="font-medium block mb-2">
              Cognome
            </label>
            <InputText
              type="text"
              id="cognome"
              name="cognome"
              placeholder="Inserire il cognome del sostenitore"
              v-model="state.cognome"
              class="w-full" />
          </div>

          <!-- <validation-error :vuelidate="v$.validCombination" /> -->
        </div>

        <!-- INFORMAZIONI PRENOTAZIONE -->
        <div v-else class="text-3xl text-center">
          <div>
            Codice Sostenitore:
            <strong>{{ infoOfReservation.idSostenitorecheck }}</strong>
          </div>
          <div>
            Nome:
            <strong>{{
              infoOfReservation.nome
                ? infoOfReservation.nome
                : "Nome non presente"
            }}</strong>
          </div>
          <div>
            Cognome:
            <strong>{{
              infoOfReservation.cognome
                ? infoOfReservation.cognome
                : "Cognome non presente"
            }}</strong>
          </div>
          <div>
            Numero Persone: <strong>{{ infoOfReservation.PersoneGds }}</strong>
          </div>
          <div>
            Centro GDS: <strong>{{ infoOfReservation.centroGDS }}</strong>
          </div>
          <div>
            Ora: <strong>{{ infoOfReservation.oraGDS }}</strong>
          </div>
        </div>
      </div>

      <!-- bottone CERCA -->
      <div class="clear-both mt-14">
        <div v-if="!infoOfReservation">
          <Button
            label="Cerca"
            class="p-button-text font-semibold block w-full mt-4 mx-auto uppercase text-3xl"
            :class="'p-button-' + formStore.color"
            @click="submit">
            <i class="pi pi-search mr-2 text-3xl"></i>
            Cerca
          </Button>
        </div>
        <div v-else class="flex justify-center gap-4">
          <Button
            label="Elimina"
            class="p-button-text font-semibold uppercase text-3x bg-red-400 text-black"
            :class="'p-button-' + formStore.color"
            @click="handleDelete">
            <i class="pi pi-trash mr-2 text-3xl"></i>
            ELIMINA
          </Button>
          <Button
            label="Modifica"
            class="p-button-text font-semibold uppercase text-3xl bg-blue-400 text-black"
            :class="'p-button-' + formStore.color"
            @click="handleEdit">
            <i class="pi pi-pencil mr-2 text-3xl"></i>
            MODIFICA
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { reactive, ref, onBeforeMount } from "vue";
import { useApiStore } from "@/store/api";
import { useFormStore } from "@/store/forms";
import ValidationError from "@/components/shared/ValidationError";
import { useLoadingStore } from "@/store/loadings";
import { useModalStore } from "@/store/modals";
// import { errorToast, warningToast, successToast } from "@/utils/toast";
import { successToast, errorToast } from "@/utils/toast";

export default {
  name: "ReservationForm",
  components: { ValidationError },
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  setup() {
    const apiStore = useApiStore();
    const formStore = useFormStore();
    const loadingStore = useLoadingStore();
    const modalStore = useModalStore();

    const hours = ref([]);

    const showStateLocation = () => {
      console.log(state);
    };

    const infoOfReservation = ref(null);

    onBeforeMount(async () => {
      // apiStore.isLoading = true;
      // const response = await apiStore.fetch(urlLocations);
      // locations.value = response;
      // apiStore.isLoading = false;
    });

    const state = reactive({
      // se mai bisognerà implementare funzionalità di modifica si può utilizzare uno state del genere
      // description: formStore.data != null ? formStore.data.description : null,
      // name: formStore.data != null ? formStore.data.name : null,
      locations: formStore.data != null ? formStore.data.centroGDS : null,
      date: formStore.data != null ? formStore.data.giornoGDS : null,
      hours: null,
      // codiceSostenitore: null,
      codiceSostenitore: null,
      persone: null,
      cognome: null,
      nome: null,
    });

    // da capire meglio tutto il discorso Vuelidate
    // Regole di validazione
    const rules = {
      validCombination: {
        validCombination: helpers.withMessage(
          "Devi inserire o il codice sostenitore o sia nome che cognome",
          () => {
            const hasCodice = state.codiceSostenitore.trim() !== "";
            const hasNome = state.nome.trim() !== "";
            const hasCognome = state.cognome.trim() !== "";

            // Valido: solo codiceSostenitore (nome e cognome vuoti)
            if (hasCodice && !hasNome && !hasCognome) {
              return true;
            }

            // Valido: solo nome e cognome (codiceSostenitore vuoto)
            if (!hasCodice && hasNome && hasCognome) {
              return true;
            }

            // Invalido: tutte le altre combinazioni
            return false;
          }
        ),
      },
    };

    const v$ = useVuelidate(rules, state);

    const submit = async () => {
      // const validate = await v$.value.$validate();
      // if (!validate) return;
      const urlDetailReservation =
        process.env.VUE_APP_API_URL +
        "/detailReservation?codiceSostenitore=" +
        state.codiceSostenitore +
        "&nome=" +
        state.nome +
        "&cognome=" +
        state.cognome;
      loadingStore.load();
      try {
        const result = await apiStore.fetch(urlDetailReservation);
        console.log(result);
        infoOfReservation.value = result[0];
        formStore.data = infoOfReservation.value;
        successToast();
      } catch (error) {
        console.error(
          "Errore durante la ricerca del codice sostenitore:",
          error.response?.data?.message || error.message
        );
        errorToast();
      }
      loadingStore.stop();
      // console.log(infoOfReservation.value);

      // if (apiStore.success === true) {
      //   context.emit("emptyTable", true);
      //   apiStore.isLoading = true;
      //   const response = await apiStore.fetch(props.url, apiStore.params);
      //   context.emit("fetchData", response);
      //   formStore.empty();
      // }
    };

    const handleDelete = () => {
      console.log("HANDLEDELETE");
      const urlDetailReservation =
        process.env.VUE_APP_API_URL +
        "/detailReservation?codiceSostenitore=" +
        state.codiceSostenitore;
      console.log(urlDetailReservation);
      modalStore.close();
      formStore.formToShow = "delete reservation";
      formStore.fill("delete", urlDetailReservation);
      modalStore.modalToShow = "reservation";
      modalStore.open("prenotazione", "delete");
      // 2093210
    };

    // QUESTA è OPENMODAL IN ACTIONSBUTTON
    // const openModal = (action) => {
    //   modalStore.open(props.itemText, action);
    //   formStore.formToShow = action + " " + props.item;
    //   modalStore.modalToShow = props.item;
    //   formStore.fill(action, urlModal);
    // };

    const handleEdit = () => {
      console.log("HANDLEEDIT");
      const urlDetailReservation =
        process.env.VUE_APP_API_URL +
        "/detailReservation?codiceSostenitore=" +
        state.codiceSostenitore;
      modalStore.close();
      formStore.formToShow = "edit reservation";
      formStore.fill("edit", urlDetailReservation);
      modalStore.modalToShow = "reservation";
      modalStore.open("prenotazione", "edit");
      // 2093210
    };

    return {
      formStore,
      submit,
      state,
      v$,
      showStateLocation,
      hours,
      infoOfReservation,
      handleDelete,
      handleEdit,
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
