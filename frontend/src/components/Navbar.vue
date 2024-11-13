<template>
  <header class="antialiased">
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-900">
      <div class="flex flex-wrap justify-between items-center">
        <div class="flex justify-start items-center">
          <div class="flex mr-4">
            <span
              v-if="user"
              class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
              >Hello, {{ user.name }}</span
            >
          </div>
        </div>
        <div class="flex items-center lg:order-2">
          <button
            type="button"
            class="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="dropdown"
          >
            <span class="sr-only">Open user menu</span>
            <div
              class="flex-shrink-0"
              style="background: transparent; border-radius: 8px; padding: 8px"
            >
              <SettingsIcon color="#ffffff" />
            </div>
          </button>
          <!-- Dropdown menu -->
          <div
            class="hidden z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
            id="dropdown"
          >
            <div class="py-3 px-4">
              <span
                class="block text-sm font-semibold text-gray-900 dark:text-white"
                >{{ user.name }}</span
              >
              <span
                class="block text-sm text-gray-500 truncate dark:text-gray-400"
                >{{ user.email }}</span
              >
            </div>
            <ul
              class="py-1 text-gray-500 dark:text-gray-400"
              aria-labelledby="dropdown"
            >
              <li>
                <button
                  @click="openAddDataModal"
                  class="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Add Data
                </button>
              </li>
              <li>
                <button
                  @click="logout"
                  class="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Add Data Modal -->
    <div
      v-if="showAddDataModal"
      id="info-popup"
      tabindex="-1"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
    >
      <div class="relative p-4 w-full max-w-lg h-full md:h-auto">
        <div
          class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8"
        >
          <div class="mb-4 text-sm font-light text-gray-500 dark:text-gray-400">
            <h3 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              Add Data
            </h3>
            <form @submit.prevent="submitData">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-400"
                  >Name</label
                >
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-400"
                  >Amount</label
                >
                <input
                  v-model="formData.amount"
                  type="number"
                  class="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-400"
                  >Notes</label
                >
                <textarea
                  v-model="formData.notes"
                  class="w-full px-3 py-2 border rounded-lg"
                  required
                ></textarea>
              </div>
              <div class="flex justify-end">
                <button
                  type="button"
                  @click="closeAddDataModal"
                  class="py-2 px-4 mr-4 w-full text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 sm:w-auto hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="py-2 px-4 w-full text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-auto hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Settings as SettingsIcon } from "lucide-vue-next";
import { useRouter } from "vue-router";
import setupAxiosInstance from "./../utils/api";
const backend_url = import.meta.env.VITE_API_URL;

const api = setupAxiosInstance();

export default defineComponent({
  name: "Navbar",
  components: {
    SettingsIcon,
  },
  setup() {
    const router = useRouter();
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const showAddDataModal = ref(false);
    const formData = ref({ name: "", amount: null, notes: "" });

    const openAddDataModal = () => (showAddDataModal.value = true);
    const closeAddDataModal = () => (showAddDataModal.value = false);

    const submitData = async () => {
      try {
        await api.post(
          `${backend_url}/items/add`,
          {
            name: formData.value.name,
            amount: formData.value.amount,
            notes: formData.value.notes,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Data added successfully!");
        closeAddDataModal();
        location.reload();
      } catch (error) {
        console.error("Error adding data:", error);
        alert("Failed to add data.");
      }
    };

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    };

    return {
      user,
      logout,
      showAddDataModal,
      formData,
      openAddDataModal,
      closeAddDataModal,
      submitData,
    };
  },
});
</script>
