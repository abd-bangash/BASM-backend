import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tabletop, TabletopDocument } from 'src/database/schemas/tabletop.schema';
import { TabletopResults, TabletopResultsDocument } from 'src/database/schemas/results.schema';
import { Search, SearchDocument } from 'src/database/schemas/search.schema';

@Injectable()
export class DashboardlogicsService {
  constructor(
    @InjectModel(Tabletop.name)
    private tabletopModel: Model<TabletopDocument>,

    @InjectModel(TabletopResults.name)
    private tabletopResultsModel: Model<TabletopResultsDocument>,

    @InjectModel(Search.name)
    private searchModel: Model<SearchDocument>,
  ) {}

  async savesearch(keyword: string, resultLength: number, source?: string) {
    // 🔹 Agar password breach search hai
    if (source === 'password-breach') {
      const existingSearch = await this.searchModel.findOne({ keyword, source });
      if (existingSearch) {
        existingSearch.set('resultLength', resultLength); // sirf number save karega
        await existingSearch.save();
        return existingSearch;
      } else {
        const newSearch = new this.searchModel({
          keyword,
          source,
          resultLength, // yahan number aa jayega jo API ne diya
        });
        return newSearch.save();
      }
    }
  
    // 🔹 Baaki (email/domain) ke liye wahi purani logic
    const existingSearch = await this.searchModel.findOne({ keyword, source });
    if (existingSearch) {
      existingSearch.set('resultLength', resultLength);
      await existingSearch.save();
      return existingSearch;
    } else {
      const newSearch = new this.searchModel({ keyword, source, resultLength });
      return newSearch.save();
    }
  }
  

  async getsearchCount(source?: string) {
    if (source) {
      return this.searchModel.countDocuments({ source });
    }
    return this.searchModel.countDocuments();
  }

  async getDashboardStats() {
    const totalCampaigns = await this.tabletopModel.countDocuments();

    const result = await this.tabletopResultsModel.aggregate([
      {
        $group: {
          _id: null,
          totalObtained: { $sum: '$obtainedMarks' },
          totalPossible: { $sum: '$totalMarks' },
        },
      },
    ]);

    let avgscore = 0;
    if (result.length > 0 && result[0].totalPossible > 0) {
      avgscore = (result[0].totalObtained / result[0].totalPossible) * 100;
    }

    const campaignGrade = this.getGrade(avgscore);

    const totalSearches = await this.getsearchCount();

    // 🔹 Email / domain exposures ka sum
    const exposuresAgg = await this.searchModel.aggregate([
      { $group: { _id: null, totalExposures: { $sum: '$resultLength' } } },
    ]);
    const totalExposuresFromSearch =
      exposuresAgg.length > 0 ? exposuresAgg[0].totalExposures : 0;

    // 🔹 Password exposures (jitni dafa search ki gayi aur breach mila)
    const passwordExposuresAgg = await this.searchModel.aggregate([
      { $match: { source: 'password-breach' } },
      { $group: { _id: null, total: { $sum: '$resultLength' } } },
    ]);
    const passwordExposure =
      passwordExposuresAgg.length > 0 ? passwordExposuresAgg[0].total : 0;

    // 🔹 Dono ko combine karo
    const totalExposures = totalExposuresFromSearch + passwordExposure;

    return {
      totalCampaigns,
      avgscore: parseFloat(avgscore.toFixed(2)),
      campaignGrade,
      totalSearches,
      totalExposures, // ✅ ab dono ka sum aa jayega
    };
  }

  private getGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score < 60) return 'D';
    return 'F';
  }
}
