// /api/get-table-data/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 86400; // Revalidate once per day

interface Grouping {
  grouping: [string, string];
  facility_name: [string, string];
  group_type: [string, string];
  area_bucket: [string, string];
  unit_group_type: [string, string];
  total_units: [number, string];
  occupied_units: [number, string];
  occupancy_rate: [number, string];
  unrentable_count: [number, string];
  reserved_count: [number, string];
  otherwise_unrentable_count: [number, string];
  available_units: [number, string];
  days_with_zero_availability: [number, string];
  days_with_low_availability: [number, string];
  days_since_last_move_in: [number | null, string];
  long_term_customer_average: [number, string];
  recent_period_average_move_in_rent: [number, string];
  average_standard_rate: [number, string];
  average_web_rate: [number, string];
  competitor_count: [number, string];
  competitor_percentage_cheaper: [number, string];
  competitor_percentage_more_expensive: [number, string];
  mean_competitor_price: [number, string];
  median_competitor_price: [number, string];
  historical_move_ins_last_x_days: [number, string];
  move_ins_last_x_days: [number, string];
  historical_move_ins_next_x_days: [number, string];
  projected_move_ins: [number, string];
  move_outs_last_x_days: [number, string];
  occupied_units_last_x_days: [number, string];
  move_out_occupied_ratio_last_x_days: [number, string];
  historical_move_outs_last_x_days: [number, string];
  historical_occupied_units_last_x_days: [number, string];
  historical_move_out_occupied_ratio_last_x_days: [number, string];
  historical_move_outs_next_x_days: [number, string];
  historical_occupied_units_next_x_days: [number, string];
  historical_move_out_occupied_ratio_next_x_days: [number, string];
  projected_move_ins_facility_scaled: [number, string];
  projected_move_ins_blended: [number, string];
  competitor_impact: [number, string];
  leasing_velocity: [number, string];
  leasing_velocity_impact: [number, string];
  projected_occupancy: [number, string];
  projected_occupancy_impact: [number, string];
  projected_move_outs_next_x_days: [number, string];
  net_rentals_last_x_days: [number, string];
  historical_net_rentals_last_x_days: [number, string];
  historical_net_rentals_next_x_days: [number, string];
  projected_net_rentals_next_x_days: [number, string];
  rate_pressure: [number, string];
  suggested_web_rate: [number, string];
  laddered_suggested_rate: [number, string];
  scaled_suggested_rate: [number, string];
  group_keys: [string[], string];
  children?: Grouping[];
};

interface ProcessedGrouping {
  level: string;
  level_description: string;
  facility_name: string;
  facility_name_description: string;
  group_type: string;
  group_type_description: string;
  area_bucket: string;
  area_bucket_description: string;
  unit_group_type: string;
  unit_group_type_description: string;
  total_units: number;
  total_units_description: string;
  occupied_units: number;
  occupied_units_description: string;
  occupancy_rate: number;
  occupancy_rate_description: string;
  unrentable_count: number;
  unrentable_count_description: string;
  reserved_count: number;
  reserved_count_description: string;
  otherwise_unrentable_count: number;
  otherwise_unrentable_count_description: string;
  available_units: number;
  available_units_description: string;
  days_with_zero_availability: number;
  days_with_zero_availability_description: string;
  days_with_low_availability: number;
  days_with_low_availability_description: string;
  days_since_last_move_in: number | null;
  days_since_last_move_in_description: string;
  long_term_customer_average: number;
  long_term_customer_average_description: string;
  recent_period_average_move_in_rent: number;
  recent_period_average_move_in_rent_description: string;
  average_standard_rate: number;
  average_standard_rate_description: string;
  average_web_rate: number;
  average_web_rate_description: string;
  competitor_count: number;
  competitor_count_description: string;
  competitor_percentage_cheaper: number;
  competitor_percentage_cheaper_description: string;
  competitor_percentage_more_expensive: number;
  competitor_percentage_more_expensive_description: string;
  mean_competitor_price: number;
  mean_competitor_price_description: string;
  median_competitor_price: number;
  median_competitor_price_description: string;
  historical_move_ins_last_x_days: number;
  historical_move_ins_last_x_days_description: string;
  move_ins_last_x_days: number;
  move_ins_last_x_days_description: string;
  historical_move_ins_next_x_days: number;
  historical_move_ins_next_x_days_description: string;
  projected_move_ins: number;
  projected_move_ins_description: string;
  move_outs_last_x_days: number;
  move_outs_last_x_days_description: string;
  occupied_units_last_x_days: number;
  occupied_units_last_x_days_description: string;
  move_out_occupied_ratio_last_x_days: number;
  move_out_occupied_ratio_last_x_days_description: string;
  historical_move_outs_last_x_days: number;
  historical_move_outs_last_x_days_description: string;
  historical_occupied_units_last_x_days: number;
  historical_occupied_units_last_x_days_description: string;
  historical_move_out_occupied_ratio_last_x_days: number;
  historical_move_out_occupied_ratio_last_x_days_description: string;
  historical_move_outs_next_x_days: number;
  historical_move_outs_next_x_days_description: string;
  historical_occupied_units_next_x_days: number;
  historical_occupied_units_next_x_days_description: string;
  historical_move_out_occupied_ratio_next_x_days: number;
  historical_move_out_occupied_ratio_next_x_days_description: string;
  projected_move_ins_facility_scaled: number;
  projected_move_ins_facility_scaled_description: string;
  projected_move_ins_blended: number;
  projected_move_ins_blended_description: string;
  competitor_impact: number;
  competitor_impact_description: string;
  leasing_velocity: number;
  leasing_velocity_description: string;
  leasing_velocity_impact: number;
  leasing_velocity_impact_description: string;
  projected_occupancy: number;
  projected_occupancy_description: string;
  projected_occupancy_impact: number;
  projected_occupancy_impact_description: string;
  projected_move_outs_next_x_days: number;
  projected_move_outs_next_x_days_description: string;
  net_rentals_last_x_days: number;
  net_rentals_last_x_days_description: string;
  historical_net_rentals_last_x_days: number;
  historical_net_rentals_last_x_days_description: string;
  historical_net_rentals_next_x_days: number;
  historical_net_rentals_next_x_days_description: string;
  projected_net_rentals_next_x_days: number;
  projected_net_rentals_next_x_days_description: string;
  rate_pressure: number;
  rate_pressure_description: string;
  suggested_web_rate: number;
  suggested_web_rate_description: string;
  laddered_suggested_rate: number;
  laddered_suggested_rate_description: string;
  scaled_suggested_rate: number;
  scaled_suggested_rate_description: string;
  group_keys: string[];
  group_keys_description: string;
  children: ProcessedGrouping[];
};

const processGrouping = (group: Grouping, parentGroup: any = {}): ProcessedGrouping => {
  const {
    grouping,
    facility_name,
    group_type,
    area_bucket,
    unit_group_type,
    total_units,
    occupied_units,
    occupancy_rate,
    unrentable_count,
    reserved_count,
    otherwise_unrentable_count,
    available_units,
    days_with_zero_availability,
    days_with_low_availability,
    days_since_last_move_in,
    long_term_customer_average,
    recent_period_average_move_in_rent,
    average_standard_rate,
    average_web_rate,
    competitor_count,
    competitor_percentage_cheaper,
    competitor_percentage_more_expensive,
    mean_competitor_price,
    median_competitor_price,
    historical_move_ins_last_x_days,
    move_ins_last_x_days,
    historical_move_ins_next_x_days,
    projected_move_ins,
    move_outs_last_x_days,
    occupied_units_last_x_days,
    move_out_occupied_ratio_last_x_days,
    historical_move_outs_last_x_days,
    historical_occupied_units_last_x_days,
    historical_move_out_occupied_ratio_last_x_days,
    historical_move_outs_next_x_days,
    historical_occupied_units_next_x_days,
    historical_move_out_occupied_ratio_next_x_days,
    projected_move_ins_facility_scaled,
    projected_move_ins_blended,
    competitor_impact,
    leasing_velocity,
    leasing_velocity_impact,
    projected_occupancy,
    projected_occupancy_impact,
    projected_move_outs_next_x_days,
    net_rentals_last_x_days,
    historical_net_rentals_last_x_days,
    historical_net_rentals_next_x_days,
    projected_net_rentals_next_x_days,
    rate_pressure,
    suggested_web_rate,
    laddered_suggested_rate,
    scaled_suggested_rate,
    group_keys,
    children,
  } = group;

  const currentGroup: ProcessedGrouping = {
    level: grouping[0],
    level_description: grouping[1],
    facility_name: facility_name[0],
    facility_name_description: facility_name[1],
    group_type: group_type[0] || parentGroup.group_type || '',
    group_type_description: group_type[1] || '',
    area_bucket: area_bucket[0] || parentGroup.area_bucket || '',
    area_bucket_description: area_bucket[1] || '',
    unit_group_type: unit_group_type[0] || parentGroup.unit_group_type || '',
    unit_group_type_description: unit_group_type[1] || '',
    total_units: total_units[0],
    total_units_description: total_units[1],
    occupied_units: occupied_units[0],
    occupied_units_description: occupied_units[1],
    occupancy_rate: occupancy_rate[0],
    occupancy_rate_description: occupancy_rate[1],
    unrentable_count: unrentable_count[0],
    unrentable_count_description: unrentable_count[1],
    reserved_count: reserved_count[0],
    reserved_count_description: reserved_count[1],
    otherwise_unrentable_count: otherwise_unrentable_count[0],
    otherwise_unrentable_count_description: otherwise_unrentable_count[1],
    available_units: available_units[0],
    available_units_description: available_units[1],
    days_with_zero_availability: days_with_zero_availability[0],
    days_with_zero_availability_description: days_with_zero_availability[1],
    days_with_low_availability: days_with_low_availability[0],
    days_with_low_availability_description: days_with_low_availability[1],
    days_since_last_move_in: days_since_last_move_in[0],
    days_since_last_move_in_description: days_since_last_move_in[1],
    long_term_customer_average: long_term_customer_average[0],
    long_term_customer_average_description: long_term_customer_average[1],
    recent_period_average_move_in_rent: recent_period_average_move_in_rent[0],
    recent_period_average_move_in_rent_description: recent_period_average_move_in_rent[1],
    average_standard_rate: average_standard_rate[0],
    average_standard_rate_description: average_standard_rate[1],
    average_web_rate: average_web_rate[0],
    average_web_rate_description: average_web_rate[1],
    competitor_count: competitor_count[0],
    competitor_count_description: competitor_count[1],
    competitor_percentage_cheaper: competitor_percentage_cheaper[0],
    competitor_percentage_cheaper_description: competitor_percentage_cheaper[1],
    competitor_percentage_more_expensive: competitor_percentage_more_expensive[0],
    competitor_percentage_more_expensive_description: competitor_percentage_more_expensive[1],
    mean_competitor_price: mean_competitor_price[0],
    mean_competitor_price_description: mean_competitor_price[1],
    median_competitor_price: median_competitor_price[0],
    median_competitor_price_description: median_competitor_price[1],
    historical_move_ins_last_x_days: historical_move_ins_last_x_days[0],
    historical_move_ins_last_x_days_description: historical_move_ins_last_x_days[1],
    move_ins_last_x_days: move_ins_last_x_days[0],
    move_ins_last_x_days_description: move_ins_last_x_days[1],
    historical_move_ins_next_x_days: historical_move_ins_next_x_days[0],
    historical_move_ins_next_x_days_description: historical_move_ins_next_x_days[1],
    projected_move_ins: projected_move_ins[0],
    projected_move_ins_description: projected_move_ins[1],
    move_outs_last_x_days: move_outs_last_x_days[0],
    move_outs_last_x_days_description: move_outs_last_x_days[1],
    occupied_units_last_x_days: occupied_units_last_x_days[0],
    occupied_units_last_x_days_description: occupied_units_last_x_days[1],
    move_out_occupied_ratio_last_x_days: move_out_occupied_ratio_last_x_days[0],
    move_out_occupied_ratio_last_x_days_description: move_out_occupied_ratio_last_x_days[1],
    historical_move_outs_last_x_days: historical_move_outs_last_x_days[0],
    historical_move_outs_last_x_days_description: historical_move_outs_last_x_days[1],
    historical_occupied_units_last_x_days: historical_occupied_units_last_x_days[0],
    historical_occupied_units_last_x_days_description: historical_occupied_units_last_x_days[1],
    historical_move_out_occupied_ratio_last_x_days: historical_move_out_occupied_ratio_last_x_days[0],
    historical_move_out_occupied_ratio_last_x_days_description: historical_move_out_occupied_ratio_last_x_days[1],
    historical_move_outs_next_x_days: historical_move_outs_next_x_days[0],
    historical_move_outs_next_x_days_description: historical_move_outs_next_x_days[1],
    historical_occupied_units_next_x_days: historical_occupied_units_next_x_days[0],
    historical_occupied_units_next_x_days_description: historical_occupied_units_next_x_days[1],
    historical_move_out_occupied_ratio_next_x_days: historical_move_out_occupied_ratio_next_x_days[0],
    historical_move_out_occupied_ratio_next_x_days_description: historical_move_out_occupied_ratio_next_x_days[1],
    projected_move_ins_facility_scaled: projected_move_ins_facility_scaled[0],
    projected_move_ins_facility_scaled_description: projected_move_ins_facility_scaled[1],
    projected_move_ins_blended: projected_move_ins_blended[0],
    projected_move_ins_blended_description: projected_move_ins_blended[1],
    competitor_impact: competitor_impact[0],
    competitor_impact_description: competitor_impact[1],
    leasing_velocity: leasing_velocity[0],
    leasing_velocity_description: leasing_velocity[1],
    leasing_velocity_impact: leasing_velocity_impact[0],
    leasing_velocity_impact_description: leasing_velocity_impact[1],
    projected_occupancy: projected_occupancy[0],
    projected_occupancy_description: projected_occupancy[1],
    projected_occupancy_impact: projected_occupancy_impact[0],
    projected_occupancy_impact_description: projected_occupancy_impact[1],
    projected_move_outs_next_x_days: projected_move_outs_next_x_days[0],
    projected_move_outs_next_x_days_description: projected_move_outs_next_x_days[1],
    net_rentals_last_x_days: net_rentals_last_x_days[0],
    net_rentals_last_x_days_description: net_rentals_last_x_days[1],
    historical_net_rentals_last_x_days: historical_net_rentals_last_x_days[0],
    historical_net_rentals_last_x_days_description: historical_net_rentals_last_x_days[1],
    historical_net_rentals_next_x_days: historical_net_rentals_next_x_days[0],
    historical_net_rentals_next_x_days_description: historical_net_rentals_next_x_days[1],
    projected_net_rentals_next_x_days: projected_net_rentals_next_x_days[0],
    projected_net_rentals_next_x_days_description: projected_net_rentals_next_x_days[1],
    rate_pressure: rate_pressure[0],
    rate_pressure_description: rate_pressure[1],
    suggested_web_rate: suggested_web_rate[0],
    suggested_web_rate_description: suggested_web_rate[1],
    laddered_suggested_rate: laddered_suggested_rate[0],
    laddered_suggested_rate_description: laddered_suggested_rate[1],
    scaled_suggested_rate: scaled_suggested_rate[0],
    scaled_suggested_rate_description: scaled_suggested_rate[1],
    group_keys: group_keys[0],
    group_keys_description: group_keys[1],
    children: [],  };

  if (children && children.length > 0) {
    currentGroup.children = children.map(child => processGrouping(child, currentGroup));
  }

  return currentGroup;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  const username = 'Qq3W6WS9X8C9';
  const password = 'Qq3W6WS9X8C9';
  const perPage = 1;
  let page = 1;
  const allData: Grouping[] = [];
  let totalItems = 0;

  try {
    while (true) {
      const response = await fetch(`https://spencermorris.pythonanywhere.com/api/summary-dataframe?page=${page}&per_page=${perPage}`, {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();

      const data = result.data;
      if (!Array.isArray(data) || data.length === 0) {
        break;
      }

      allData.push(...data);
      totalItems += data.length;
      page += 1;
    }

    const processedData: ProcessedGrouping[] = allData.map(group => processGrouping(group));

    return NextResponse.json({ totalItems, data: processedData }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}