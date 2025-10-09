import { Injectable, Inject } from '@nestjs/common';
import {Cache, CACHE_MANAGER} from "@nestjs/cache-manager";

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getHello() {
    await this.cacheManager.set('cached_item', { key: 32 }, 60);
    const cacheItem = await this.cacheManager.get('cached_item');
    console.log(cacheItem);
    return { message: 'Hello World!' };
  }
  // async saveDataToCache(data: any) {
  //    const key = '123'// Generate a unique key - or this could be unique user key from database or campaign id
  //   await this.cacheManager.set(key, data, 0); // To disable expiration of the cache for now
  //   // cache time will vary regarding to the campaign time - get it out of the database
  //   return { message: 'Data saved successfully', key };
  // }
}
