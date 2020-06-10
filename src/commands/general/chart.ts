import BaseCommand from "../../structures/BaseCommand";
import Context from "../../structures/Context";
import { CanvasRenderService } from "chartjs-node-canvas";
import DiscordEmbed from "../../utils/DiscordEmbed";
import Watchdog from "../../structures/Watchdog";
import { IData } from "../../models/dataschema";

export default class Info extends BaseCommand {
    constructor() {
        super({
            name: "chart",
            description: "Show specific chart of the bot",
            usage: "chart [type: guilds, users, ping]",
            aliases: [],
            requirements: [],
            deleteMessage: false,
        });
    }

    async execute(ctx: Context, base: Watchdog) {
        const width = 1400;
        const height = 800;
        const ticksOptions = [{ ticks: { fontColor: "white", fontSize: 16 } }];
        const options = {
            backgroundColor: "#FFFFFF",
            scales: { yAxes: ticksOptions, xAxes: ticksOptions },
            legend: {
                // display: false
                labels: {
                    fontColor: "white",
                    fontSize: 16,
                },
            },
            // Performance improvements
            animation: {
                duration: 0, // general animation time
            },
            hover: {
                animationDuration: 0, // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0, // animation duration after a resize
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                },
            },
        };
        const embed = new DiscordEmbed().setTitle("Chart");
        const canvasRenderService = new CanvasRenderService(
            width,
            height,
            () => {}
        );

        let type = ctx.args[0];
        type = type ? type.toLowerCase() : "";
        const data = await base.database.Data.find(type ? { type } : {});
        if (!data.length) {
            embed.setDescription("This type of chart doesn't exist");
            return ctx.embed(embed.getEmbed());
        }

        const colors = [
            { bgColor: "rgba(255,99,132,0.2)", bColor: "rgba(255,99,132,1)" },
            { bgColor: "rgba(255,238,136,0.2)", bColor: "rgba(255,238,136,1)" },
            { bgColor: "rgba(128,255,0,0.2)", bColor: "rgba(128,255,0,1)" },
        ];

        function datasets(data: IData[]) {
            return data.map((x: IData, i: number) => {
                return {
                    label:
                        x.type !== "pings" ? `# of ${x.type}` : "average pings",
                    data: x.amounts,
                    backgroundColor: colors[i].bgColor,
                    borderColor: colors[i].bColor,
                };
            });
        }

        const image = await canvasRenderService.renderToBuffer({
            type: "line",
            data: {
                labels: data
                    ? data[0].dates.map((date) => {
                          const cur = new Date(date);

                          return `${cur.getUTCMonth() + 1}/${cur.getUTCDate()}`;
                      })
                    : ["N/A"],
                datasets: datasets(data),
            },
            options,
        });

        embed.setImage("attachment://Chart.png");

        return ctx.bot.createMessage(
            ctx.channel.id,
            { embed: embed.getEmbed() },
            { file: image, name: "Chart.png" }
        );
    }
}
