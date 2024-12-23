/**
 * nekocord, a Discord client mod
 * Copyright (C) 2024 nekohaxx and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Plugin } from "../../types/PluginManager";
import { SelectedChannelStore } from "../../webpack/WebpackModules";

export class ForwardHereFirst implements Plugin {
    info = {
        name: "ForwardHereFirst",
        id: "dev.hhls.forwardherefirst",
        authors: [{ name: "HHLS", id: "903418691268513883" }],
        description: "Prioritizes the current channel in the forward list",
        version: "0.1.0",
        patches: [
            {
                find: ".record;!",
                replacement: {
                    match: /(\i\()(\i)(,\i\)\.slice)/,
                    replace: "$self.patch($2).slice"
                }
            }
        ],
    };

    patch(rowData: any) {
        const channelId = SelectedChannelStore.getChannelId();
        if (!channelId) return rowData;
        const results = [];
        const priority = rowData.filter((r: any) => r.record.id == channelId);
        if (priority.length) {
            results.push(priority[0]);
        }
        const remaining = rowData.filter((r: any) => r.record.id != channelId);
        for (const row of remaining) {
            if (!results.find((r: any) => r.record.id == row.record.id)) {
                results.push(row);
            }
        }
        return results;
    }
}
