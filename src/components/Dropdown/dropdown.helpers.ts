import type { DropdownItem, DropdownValue } from './Dropdown.types';

// Kaynak: tatilbudurapp-v82 / src/components/Dropdown/utils/dropdown.helpers.ts
// Yan etkisiz, saf fonksiyonlar — hem web hem native tarafından paylaşılır.

const normalize = (text: string) =>
  text
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i');

/** label'ı `query` içeren öğeleri döndürür (Türkçe'ye duyarlı, büyük/küçük harf gözetmez). */
export function filterItems<T extends DropdownValue>(
  items: DropdownItem<T>[],
  query: string
): DropdownItem<T>[] {
  if (!query.trim()) return items;
  const search = normalize(query.trim());
  return items.filter((item) => normalize(item.label).includes(search));
}

/** `item`'ın mevcut seçimin bir parçası olup olmadığını döndürür. */
export function isItemSelected<T extends DropdownValue>(
  item: DropdownItem<T>,
  value: T | T[] | null,
  multiple: boolean
): boolean {
  if (value === null || value === undefined) return false;
  if (multiple && Array.isArray(value)) {
    return value.includes(item.value);
  }
  return item.value === value;
}

/** Çoklu seçim dizisinde `newValue`'yu ekler veya çıkarır. */
export function toggleMultipleValue<T extends DropdownValue>(
  currentValues: T[] | null,
  newValue: T
): T[] {
  const current = currentValues ?? [];
  return current.includes(newValue)
    ? current.filter((v) => v !== newValue)
    : [...current, newValue];
}

/** Verilen değer(ler) için tam DropdownItem nesnelerini çözer. */
export function getSelectedItems<T extends DropdownValue>(
  items: DropdownItem<T>[],
  value: T | T[] | null,
  multiple: boolean
): DropdownItem<T>[] {
  if (value === null || value === undefined) return [];
  if (multiple && Array.isArray(value)) {
    return items.filter((item) => value.includes(item.value));
  }
  const found = items.find((item) => item.value === value);
  return found ? [found] : [];
}

/** Liste öğeleri için varsayılan React key. */
export function defaultKeyExtractor<T extends DropdownValue>(
  item: DropdownItem<T>
): string {
  return String(item.id ?? item.value);
}

/**
 * İnsan tarafından okunabilir tetikleyici metni üretir.
 * - Hiçbir şey seçili değil → undefined (çağıran placeholder gösterir)
 * - Tekli                   → item.label
 * - Çoklu, 1 öğe            → item.label
 * - Çoklu, n > 1            → "Label +N tane daha"
 */
export function buildTriggerLabel<T extends DropdownValue>(
  selectedItems: DropdownItem<T>[]
): string | undefined {
  if (selectedItems.length === 0) return undefined;
  if (selectedItems.length === 1) return selectedItems[0].label;
  return `${selectedItems[0].label} +${selectedItems.length - 1} tane daha`;
}
