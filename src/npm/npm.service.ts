import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NpmService {
  async getPackageInfo(tech: string) {
    try {
      // Search npm for top packages matching the tech
      const searchRes = await axios.get(
        `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(tech)}&size=5`,
        { timeout: 5000 }
      );

      const packages = searchRes.data.objects || [];

      const results = await Promise.all(
        packages.slice(0, 5).map(async (pkg: any) => {
          const name = pkg.package.name;

          try {
            // Get download count for this package
            const downloadsRes = await axios.get(
              `https://api.npmjs.org/downloads/point/last-week/${name}`,
              { timeout: 3000 }
            );

            return {
              name,
              version: pkg.package.version,
              description: pkg.package.description || 'No description',
              url: `https://www.npmjs.com/package/${name}`,
              weeklyDownloads: downloadsRes.data.downloads || 0,
              date: pkg.package.date,
            };
          } catch {
            return {
              name,
              version: pkg.package.version,
              description: pkg.package.description || 'No description',
              url: `https://www.npmjs.com/package/${name}`,
              weeklyDownloads: 0,
              date: pkg.package.date,
            };
          }
        })
      );

      return results;
    } catch {
      return [];
    }
  }
}