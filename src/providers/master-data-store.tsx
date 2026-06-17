'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_MASTER_DATA,
  type CompanySettings,
  type MasterDataCollection,
  type MasterDataState,
} from '@/lib/data/master-data';
import {
  castRecords,
  createMasterRecordApi,
  deleteMasterRecordApi,
  fetchCompanySettings,
  fetchMasterCollection,
  patchCompanySettings,
  updateMasterRecordApi,
} from '@/lib/master-data/api-client';
import { useAuthStore } from '@/providers/auth-store';

type MasterDataStoreContextValue = {
  loading: boolean;
  error: string | null;
  companySettings: CompanySettings;
  plants: MasterDataState['plants'];
  shifts: MasterDataState['shifts'];
  departments: MasterDataState['departments'];
  unitsOfMeasure: MasterDataState['unitsOfMeasure'];
  itemCategories: MasterDataState['itemCategories'];
  items: MasterDataState['items'];
  warehouses: MasterDataState['warehouses'];
  productionLines: MasterDataState['productionLines'];
  machines: MasterDataState['machines'];
  operations: MasterDataState['operations'];
  suppliers: MasterDataState['suppliers'];
  customers: MasterDataState['customers'];
  defectTypes: MasterDataState['defectTypes'];
  maintenanceTypes: MasterDataState['maintenanceTypes'];
  expenseCategories: MasterDataState['expenseCategories'];
  refresh: () => Promise<void>;
  updateCompanySettings: (settings: CompanySettings) => Promise<void>;
  addRecord: (collection: MasterDataCollection, record: Record<string, unknown>) => Promise<void>;
  updateRecord: (
    collection: MasterDataCollection,
    id: string,
    patch: Record<string, unknown>,
  ) => Promise<void>;
  deleteRecord: (collection: MasterDataCollection, id: string) => Promise<void>;
  getPlantName: (id: string) => string;
  getCategoryName: (id: string) => string;
  getUnitName: (id: string) => string;
  getLineName: (id: string) => string;
};

const MasterDataStoreContext = createContext<MasterDataStoreContextValue | null>(null);

const MASTER_COLLECTIONS: MasterDataCollection[] = [
  'plants',
  'shifts',
  'departments',
  'unitsOfMeasure',
  'itemCategories',
  'items',
  'warehouses',
  'productionLines',
  'machines',
  'operations',
  'suppliers',
  'customers',
  'defectTypes',
  'maintenanceTypes',
  'expenseCategories',
];

export function MasterDataStoreProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const [state, setState] = useState<MasterDataState>(DEFAULT_MASTER_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setState(DEFAULT_MASTER_DATA);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [companySettings, ...collections] = await Promise.all([
        fetchCompanySettings(),
        ...MASTER_COLLECTIONS.map((key) => fetchMasterCollection(key)),
      ]);

      setState({
        companySettings: companySettings ?? DEFAULT_MASTER_DATA.companySettings,
        plants: castRecords(collections[0]),
        shifts: castRecords(collections[1]),
        departments: castRecords(collections[2]),
        unitsOfMeasure: castRecords(collections[3]),
        itemCategories: castRecords(collections[4]),
        items: castRecords(collections[5]),
        warehouses: castRecords(collections[6]),
        productionLines: castRecords(collections[7]),
        machines: castRecords(collections[8]),
        operations: castRecords(collections[9]),
        suppliers: castRecords(collections[10]),
        customers: castRecords(collections[11]),
        defectTypes: castRecords(collections[12]),
        maintenanceTypes: castRecords(collections[13]),
        expenseCategories: castRecords(collections[14]),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load master data.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  const updateCompanySettings = useCallback(async (settings: CompanySettings) => {
    const updated = await patchCompanySettings(settings);
    setState((prev) => ({ ...prev, companySettings: updated }));
  }, []);

  const addRecord = useCallback(
    async (collection: MasterDataCollection, record: Record<string, unknown>) => {
      const created = await createMasterRecordApi(collection, record);
      setState((prev) => ({
        ...prev,
        [collection]: [created, ...(prev[collection] as { id: string }[])],
      }));
    },
    [],
  );

  const updateRecord = useCallback(
    async (collection: MasterDataCollection, id: string, patch: Record<string, unknown>) => {
      const updated = await updateMasterRecordApi(collection, id, patch);
      setState((prev) => ({
        ...prev,
        [collection]: (prev[collection] as { id: string }[]).map((item) =>
          item.id === id ? { ...item, ...updated } : item,
        ),
      }));
    },
    [],
  );

  const deleteRecord = useCallback(async (collection: MasterDataCollection, id: string) => {
    await deleteMasterRecordApi(collection, id);
    setState((prev) => ({
      ...prev,
      [collection]: (prev[collection] as { id: string }[]).filter((item) => item.id !== id),
    }));
  }, []);

  const getPlantName = useCallback(
    (id: string) => state.plants.find((p) => p.id === id)?.name ?? id,
    [state.plants],
  );

  const getCategoryName = useCallback(
    (id: string) => state.itemCategories.find((c) => c.id === id)?.name ?? id,
    [state.itemCategories],
  );

  const getUnitName = useCallback(
    (id: string) => state.unitsOfMeasure.find((u) => u.id === id)?.name ?? id,
    [state.unitsOfMeasure],
  );

  const getLineName = useCallback(
    (id: string) => state.productionLines.find((l) => l.id === id)?.name ?? id,
    [state.productionLines],
  );

  const value = useMemo(
    () => ({
      loading,
      error,
      companySettings: state.companySettings,
      plants: state.plants,
      shifts: state.shifts,
      departments: state.departments,
      unitsOfMeasure: state.unitsOfMeasure,
      itemCategories: state.itemCategories,
      items: state.items,
      warehouses: state.warehouses,
      productionLines: state.productionLines,
      machines: state.machines,
      operations: state.operations,
      suppliers: state.suppliers,
      customers: state.customers,
      defectTypes: state.defectTypes,
      maintenanceTypes: state.maintenanceTypes,
      expenseCategories: state.expenseCategories,
      refresh,
      updateCompanySettings,
      addRecord,
      updateRecord,
      deleteRecord,
      getPlantName,
      getCategoryName,
      getUnitName,
      getLineName,
    }),
    [
      loading,
      error,
      state,
      refresh,
      updateCompanySettings,
      addRecord,
      updateRecord,
      deleteRecord,
      getPlantName,
      getCategoryName,
      getUnitName,
      getLineName,
    ],
  );

  return (
    <MasterDataStoreContext.Provider value={value}>{children}</MasterDataStoreContext.Provider>
  );
}

export function useMasterDataStore() {
  const ctx = useContext(MasterDataStoreContext);
  if (!ctx) throw new Error('useMasterDataStore must be used within MasterDataStoreProvider');
  return ctx;
}
