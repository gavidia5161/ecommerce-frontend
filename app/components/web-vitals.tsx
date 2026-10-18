"use client";

import { useCallback } from "react";
import { useReportWebVitals } from "next/web-vitals";

type Metric = Parameters<typeof useReportWebVitals>[0] extends (metric: infer T) => void
  ? T
  : never;

export default function WebVitalsReporter() {
  const reportMetric = useCallback((metric: Metric) => {
    console.info("[Web Vitals]", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  }, []);

  useReportWebVitals(reportMetric);
  return null;
}
