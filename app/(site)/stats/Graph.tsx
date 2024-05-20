import { StatsType } from "./StatsType";
import { Button } from "@/components/ui/button";
import { BarChart } from "@mui/x-charts/BarChart";
import { createTheme, ThemeProvider } from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import {
  blueberryTwilightPalette,
  mangoFusionPalette,
  cheerfulFiestaPalette,
} from "@mui/x-charts/colorPalettes";
import { useTheme } from "next-themes";

export default function Graph({
  results,
}: {
  results: { index: number; data: StatsType[] }[];
}) {
  console.log(results);
  // se aggiungo 2 campi nuovi, lascio vuoto il primo, completo il secondo, e poi il primo
  // nell'array results ci sarà prima il risultato del secondo, poi del primo
  // da ordinare in base all'index cosi da rispettare l'ordine dei grafici con le statistiche
  function formatData(result: StatsType[]): any[] {
    if (!result || result.length === 0) {
      return [];
    }

    const formattedData: any[] = [];
    result.forEach(({ totalOrders, totalHours, totalPay, totalTip, totalMoney }) => {
      const riderData: any = {};

      if (totalOrders !== undefined) {
        riderData.orders = totalOrders;
      }
      if (totalHours !== undefined) {
        riderData.hours = totalHours;
      }
      if (totalPay !== undefined) {
        riderData.pay = totalPay;
      }
      if (totalTip !== undefined) {
        riderData.tip = totalTip;
      }
      if (totalMoney !== undefined) {
        riderData.total = totalMoney;
      }

      formattedData.push(riderData);
    });

    return formattedData;
  }

  function generateSeries(data: any[]): { dataKey: string; label: string }[] {
    const series: { dataKey: string; label: string }[] = [];

    if (data.some((item) => item.orders !== undefined)) {
      series.push({ dataKey: "orders", label: "Consegne" });
    }

    if (data.some((item) => item.hours !== undefined)) {
      series.push({ dataKey: "hours", label: "Ore" });
    }

    if (data.some((item) => item.pay !== undefined)) {
      series.push({ dataKey: "pay", label: "Paga" });
    }

    if (data.some((item) => item.tip !== undefined)) {
      series.push({ dataKey: "tip", label: "Mancia" });
    }

    if (data.some((item) => item.total !== undefined)) {
      series.push({ dataKey: "total", label: "Incasso" });
    }

    return series;
  }

  const [open, setOpen] = useState<boolean>(false);
  function handleOpen() {
    setOpen(true);
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  }

  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-[70vw]">
      {/* <Button onClick={handleOpen}>Genera grafico</Button> */}

      {results && (
        <div className="max-w-none h-[500px] w-[120%] p-4 flex flex-wrap overflow-y-auto items-center justify-center">
          {results.map(({ index, data }) => {
            const numGraphs = results.length;
            let widthClass = "h-[100%] ";
            widthClass += "w-[100%]";
            //

            // if (numGraphs % 3 === 0) {
            //   widthClass += "w-[32%]";
            // } else if (numGraphs % 2 === 0) {
            //   widthClass += "w-[49%]";
            // } else {
            //   widthClass += "w-full";
            // }

            const colors = ["#0000FF", "#FFFF00", "#FF00FF"];

            return (
              <div
                key={index}
                className={widthClass}
                style={{ minHeight: "300px" }}
              >
                <ThemeProvider
                  theme={createTheme({
                    palette: { mode: theme == "light" ? "light" : "dark" },
                  })}
                >
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: data.map(({ riderName }) => riderName),
                      },
                    ]}
                    dataset={formatData(data)}
                    sx={{ width: "100%", height: "100%" }}
                    colors={["#00C0FF", "#D81B9B", "#FF0000", "#0AFFD5", "#B94BC6"]}
                    series={generateSeries(formatData(data))}
                    slotProps={{
                      noDataOverlay: { message: "TEST TEST TEST" },
                    }}
                  />
                </ThemeProvider>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
