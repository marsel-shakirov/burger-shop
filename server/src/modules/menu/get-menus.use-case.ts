import { findMenus } from './menus.repository.ts';

export async function getMenusUseCase() {
  return findMenus();
}
