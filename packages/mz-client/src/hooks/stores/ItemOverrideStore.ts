import { produce } from 'immer';
import { create } from 'zustand';
import { ItemStats } from '~/lib/api/types';

interface OverridableItem {
  isLiked?: boolean;
  itemStats?: ItemStats;
  isBookmarked?: boolean;
}

interface ItemOverrideStore {
  overrides: {
    [key: number]: OverridableItem | undefined;
  };
  set: (itemId: number, overridableItem: OverridableItem) => void;
}

export const useItemOverrideStore = create<ItemOverrideStore>((set) => ({
  overrides: {},
  set: (itemId, overridableItem) =>
    set((store) =>
      produce(store, (draft) => {
        draft.overrides[itemId] = overridableItem;
      }),
    ),
}));

export const useItemOverrideById = (itemId: number) => {
  const overrides = useItemOverrideStore((store) => store.overrides);
  return overrides[itemId];
};

export const useItemOverrideSetter = () => {
  return useItemOverrideStore((store) => store.set);
};
