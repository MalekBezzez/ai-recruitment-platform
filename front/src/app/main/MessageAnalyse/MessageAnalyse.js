import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';

/* ============================
   D3Chart — robuste + tooltips corrects
============================ */
const D3Chart = ({ data, options, width = 600, height = 400, chartType, containerRef }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: width || 600, height: height || 400 });

  function wrapText(textSelection, width) {
    textSelection.each(function () {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word, line = [];
      let lineNumber = 0;
      const lineHeight = 1.2;
      const y = text.attr("y");
      const dy = parseFloat(text.attr("dy")) || 0;
      let tspan = text.text(null)
        .append("tspan")
        .attr("x", -5)
        .attr("y", y)
        .attr("dy", `${dy}em`);

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
            .attr("x", -5)
            .attr("y", y)
            .attr("dy", `${++lineNumber * lineHeight}em`)
            .text(word);
        }
      }
    });
  }

  useEffect(() => {
    let calculatedWidth = width || 600;
    let calculatedHeight = height || 400;

    if (containerRef?.current?.offsetWidth) {
      try {
        const cw = containerRef.current.offsetWidth - 32;
        if (cw > 0) calculatedWidth = Math.max(300, Math.min(cw, 700));
        if (options?.indexAxis === 'y' && data?.labels) {
          const minH = data.labels.length * 60 + 200;
          calculatedHeight = Math.max(minH, 400);
        }
      } catch {
        calculatedWidth = width || 600;
        calculatedHeight = height || 400;
      }
    }

    setDimensions(prev => ({
      width: Math.max(prev.width, calculatedWidth),
      height: Math.max(prev.height, calculatedHeight),
    }));
  }, [width, height, containerRef, options, data]);

  useEffect(() => {
    if (!data?.datasets || !Array.isArray(data.datasets) || data.datasets.length === 0) return;
    if (chartType !== 'donut' && (!data.labels || !Array.isArray(data.labels))) return;

    const actualWidth = dimensions.width;
    const actualHeight = dimensions.height;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    let leftMargin = 60;
    if (options?.indexAxis === 'y' && data.labels) {
      const maxLabelLength = Math.max(...data.labels.map(label => label ? label.length : 0));
      leftMargin = Math.max(120, Math.min(actualWidth * 0.35, maxLabelLength * 6 + 40));
    }

    const margin = { top: 40, right: 20, bottom: 80, left: leftMargin };
    const innerWidth = actualWidth - margin.left - margin.right;
    const innerHeight = actualHeight - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    if (chartType === 'donut') {
      // on privilégie counts pour calculer les pourcentages
      const values = (data.datasets[0].counts &&
                      data.datasets[0].counts.length === data.datasets[0].data.length)
        ? data.datasets[0].counts
        : data.datasets[0].data;

      const total = d3.sum(values);
      const radius = Math.min(innerWidth, innerHeight) / 2;

      const pie = d3.pie().sort(null).value(d => +d || 0);
      const arc = d3.arc().innerRadius(radius * 0.4).outerRadius(radius * 0.8);
      const pieData = pie(values);

      const arcs = g.selectAll(".arc")
        .data(pieData)
        .enter().append("g")
        .attr("class", "arc")
        .attr("transform", `translate(${innerWidth / 2}, ${innerHeight / 2})`);

      arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => data.datasets[0].backgroundColor[d.index] || 'gray')
        .attr("stroke", 'white')
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
          d3.selectAll(".d3-tooltip").remove();
          const tooltip = d3.select("body").append("div")
            .attr("class", "d3-tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.8)")
            .style("color", "white")
            .style("padding", "10px")
            .style("border-radius", "6px")
            .style("font-size", "14px")
            .style("pointer-events", "none")
            .style("z-index", "9999");
          tooltip.transition().duration(200).style("opacity", 0.9);

          const count = values[d.index] ?? 0;
          const pct = total ? (count / total) * 100 : 0;
          const countText = count ? ` (${count} message${count > 1 ? 's' : ''})` : '';

          tooltip.html(`<strong>${data.labels[d.index]}</strong><br/>${pct.toFixed(1)}%${countText}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => d3.selectAll(".d3-tooltip").remove());

      arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text(d => {
          const pct = total ? (values[d.index] / total) * 100 : 0;
          return pct >= 5 ? `${pct.toFixed(1)}%` : '';
        });

    } else if (options?.indexAxis === 'y') {
      const xScale = d3.scaleLinear()
        .domain([0, options?.scales?.x?.max || d3.max(data.datasets[0].data) || 0])
        .range([0, innerWidth]);

      const yScale = d3.scaleBand()
        .domain(data.labels.map((_, i) => i))
        .range([0, innerHeight])
        .padding(0.2);

      const barsData = data.datasets[0].data.map((value, index) => ({
        value,
        index,
        label: data.labels[index]
      }));

      g.selectAll(".bar")
        .data(barsData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => yScale(d.index))
        .attr("width", d => xScale(d.value))
        .attr("height", yScale.bandwidth())
        .attr("fill", data.datasets[0].backgroundColor)
        .attr("stroke", data.datasets[0].borderColor)
        .attr("stroke-width", data.datasets[0].borderWidth || 1)
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
          d3.selectAll(".d3-tooltip").remove();
          const tooltip = d3.select("body").append("div")
            .attr("class", "d3-tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.8)")
            .style("color", "white")
            .style("padding", "10px")
            .style("border-radius", "6px")
            .style("font-size", "14px")
            .style("pointer-events", "none")
            .style("max-width", "300px")
            .style("word-wrap", "break-word")
            .style("z-index", "9999");

          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(`<strong>Catégorie :</strong> ${d.label}<br/><strong>Messages :</strong> ${d.value}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => d3.selectAll(".d3-tooltip").remove());

      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(10).tickFormat(d => Number.isInteger(d) ? d : ''));

      g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d => data.labels[d] || ''))
        .selectAll("text")
        .style("font-size", "12px")
        .style("fill", "#333")
        .style("text-anchor", "end")
        .attr("dy", 0)
        .attr("dx", "-0.5em")
        .call(wrapText, leftMargin - 10);

      if (options?.scales?.x?.title?.text) {
        g.append("text")
          .attr("transform", `translate(${innerWidth/2}, ${innerHeight + 35})`)
          .style("text-anchor", "middle")
          .style("font-size", "12px")
          .text(options.scales.x.title.text);
      }

      if (options?.scales?.y?.title?.text) {
        g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 15)
          .attr("x", 0 - (innerHeight / 2))
          .style("text-anchor", "middle")
          .style("font-size", "12px")
          .style("fill", "#666")
          .text(options.scales.y.title.text);
      }

    } else {
      const xScale = d3.scaleBand()
        .domain(data.labels)
        .range([0, innerWidth])
        .padding(0.2);

      const yMax = d3.max(data.datasets[0].data) || 0;
      const yScale = d3.scaleLinear()
        .domain([0, yMax * 1.1])
        .range([innerHeight, 0]);

      g.selectAll(".bar")
        .data(data.datasets[0].data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(data.labels[i]))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d))
        .attr("fill", data.datasets[0].backgroundColor)
        .attr("stroke", data.datasets[0].borderColor)
        .attr("stroke-width", data.datasets[0].borderWidth || 1)
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
          const index = data.datasets[0].data.indexOf(d);
          const label = data.labels[index];
          d3.selectAll(".d3-tooltip").remove();

          const tooltip = d3.select("body").append("div")
            .attr("class", "d3-tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.8)")
            .style("color", "white")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("z-index", "9999");

          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip.html(`${label}: ${Number.isFinite(d) ? d : 0} messages`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => d3.selectAll(".d3-tooltip").remove());

      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-1em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")
        .style("font-size", "12px");

      g.append("g").call(d3.axisLeft(yScale));

      if (options?.scales?.y?.title?.text) {
        g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 40)
          .attr("x", 0 - (innerHeight / 2))
          .style("text-anchor", "middle")
          .text(options.scales.y.title.text);
      }

      if (options?.scales?.x?.title?.text) {
        g.append("text")
          .attr("transform", `translate(${innerWidth/2}, ${innerHeight + 45})`)
          .style("text-anchor", "middle")
          .text(options.scales.x.title.text);
      }
    }

    if (options?.plugins?.title?.text) {
      svg.append("text")
        .attr("x", actualWidth / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", options?.plugins?.title?.font?.size || 16)
        .style("font-weight", "bold")
        .text(options.plugins.title.text);
    }
  }, [data, options, chartType, dimensions]);

  return <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full h-auto"></svg>;
};

/* ============================
   MessageAnalyse — filtre Employés élargi + popups
============================ */
const MessageAnalyse = () => {
  const { questionnaireId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback server
  const [serverSentimentCounts, setServerSentimentCounts] = useState(null);
  const [serverTopicCounts, setServerTopicCounts] = useState(null);
  const [serverEmotionCounts, setServerEmotionCounts] = useState(null);

  // Items pour filtrage
  const [rawItems, setRawItems] = useState([]); // [{ employeeId, employeeName, sentiment, topic, emotion }]

  // Filtre Employé (agrandi)
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState(new Set());
  const [employeeQuery, setEmployeeQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  // Popups
  const [showTopicPopup, setShowTopicPopup]   = useState(false);
  const [showEmotionPopup, setShowEmotionPopup] = useState(false);

  // Refs charts
  const donutContainerRef = useRef();
  const topicContainerRef = useRef();
  const emotionContainerRef = useRef();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
        if (!token) throw new Error('No authentication token found');
        const headers = { Authorization: `Bearer ${token}` };

        const res = await fetch(`${API_URL}/prediction/results/by-idtest/${questionnaireId}`, { headers });
        if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`);

        const chartData = await res.json();

        setServerSentimentCounts(chartData.sentimentCounts || null);
        setServerTopicCounts(chartData.topicCounts || null);
        setServerEmotionCounts(chartData.emotionCounts || null);

        setRawItems(Array.isArray(chartData.items) ? chartData.items : []); // <— activer côté backend
        setError(null);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (questionnaireId) fetchData();
    else {
      setError('Missing message ID');
      setLoading(false);
    }
  }, [questionnaireId, API_URL]);

  // Liste employés
  const employees = useMemo(() => {
    const map = new Map();
    for (const it of rawItems) {
      const id = String(it.employeeId ?? '');
      if (!id) continue;
      const name = it.employeeName || `Employee ${id}`;
      map.set(id, name);
    }
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [rawItems]);

  const visibleEmployees = useMemo(() => {
    const q = employeeQuery.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(e => e.name.toLowerCase().includes(q));
  }, [employees, employeeQuery]);

  // Filtre appliqué
  const filteredItems = useMemo(() => {
    if (!rawItems.length) return [];
    if (!selectedEmployeeIds.size) return rawItems;
    return rawItems.filter(it => selectedEmployeeIds.has(String(it.employeeId)));
  }, [rawItems, selectedEmployeeIds]);

  // Datasets depuis items filtrés
  const chartsFromItems = useMemo(() => {
    if (!filteredItems.length) return null;

    const sCounts = { Positive: 0, Neutral: 0, Negative: 0 };
    const tCounts = {};
    const eCounts = {};

    for (const it of filteredItems) {
      const s = it.sentiment || 'Neutral';
      if (sCounts[s] == null) sCounts[s] = 0;
      sCounts[s]++;

      const topic = it.topic || 'Unknown';
      tCounts[topic] = (tCounts[topic] || 0) + 1;

      const emotion = it.emotion || 'Unknown';
      eCounts[emotion] = (eCounts[emotion] || 0) + 1;
    }

    const total = Object.values(sCounts).reduce((a, b) => a + b, 0) || 0;
    const pct = k => total ? (sCounts[k] / total) * 100 : 0;

    const sentimentDistributionData = {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [{
        label: 'Sentiment Distribution (%)',
        data: [pct('Positive'), pct('Neutral'), pct('Negative')],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['rgba(16, 185, 129, 1)', 'rgba(99, 102, 241, 1)', 'rgba(239, 68, 68, 1)'],
        borderWidth: 2,
        counts: [sCounts.Positive || 0, sCounts.Neutral || 0, sCounts.Negative || 0],
      }],
    };

    const toBar = (obj, label, color) => {
      const sorted = Object.entries(obj).sort(([, a], [, b]) => b - a);
      return {
        labels: sorted.map(([k]) => k),
        datasets: [{
          label,
          data: sorted.map(([, v]) => v),
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
        }],
      };
    };

    const topicFrequencyData   = toBar(tCounts, 'Topic Frequency',   'rgba(190, 223, 250, 1)');
    const emotionFrequencyData = toBar(eCounts, 'Emotion Frequency', 'rgba(224, 68, 40, 0.7)');

    return { sentimentDistributionData, topicFrequencyData, emotionFrequencyData };
  }, [filteredItems]);

  // Fallback serveur
  const chartsFromServer = useMemo(() => {
    if (!serverSentimentCounts || !serverTopicCounts || !serverEmotionCounts) return null;

    const total = Object.values(serverSentimentCounts).reduce((s, c) => s + c, 0);
    const pct = k => total ? (serverSentimentCounts[k] / total) * 100 : 0;

    const sentimentDistributionData = {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [{
        label: 'Sentiment Distribution (%)',
        data: [pct('Positive'), pct('Neutral'), pct('Negative')],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['rgba(16, 185, 129, 1)', 'rgba(99, 102, 241, 1)', 'rgba(239, 68, 68, 1)'],
        borderWidth: 2,
        counts: [serverSentimentCounts.Positive || 0, serverSentimentCounts.Neutral || 0, serverSentimentCounts.Negative || 0],
      }],
    };

    const toBar = (obj, label, color) => {
      const sorted = Object.entries(obj).sort(([, a], [, b]) => b - a);
      return {
        labels: sorted.map(([k]) => k),
        datasets: [{
          label,
          data: sorted.map(([, v]) => v),
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
        }],
      };
    };

    const topicFrequencyData   = toBar(serverTopicCounts, 'Topic Frequency', 'rgba(190, 223, 250, 1)');
    const emotionFrequencyData = toBar(serverEmotionCounts, 'Emotion Frequency', 'rgba(224, 68, 40, 0.7)');

    return { sentimentDistributionData, topicFrequencyData, emotionFrequencyData };
  }, [serverSentimentCounts, serverTopicCounts, serverEmotionCounts]);

  const charts = chartsFromItems || chartsFromServer;
  const hasItems = rawItems.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-8 rounded-lg shadow-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium text-red-800">Erreur de chargement</h3>
                <p className="text-red-700 mt-3">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center gap-6 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sentiment Analysis Dashboard
              </h1>
              <p className="text-gray-600 mt-2 md:mt-3 text-base md:text-lg">
                Analyse des messages {questionnaireId && `- #${questionnaireId}`}
              </p>
            </div>

            {/* FILTRE EMPLOYÉS — agrandi */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(s => !s)}
                disabled={!hasItems}
                className={`bg-white border px-5 py-3 rounded-xl shadow-sm hover:shadow transition flex items-center gap-3 text-sm md:text-base ${!hasItems ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <span className="text-lg">👤</span>
                <span className="font-medium">Employees</span>
                <span className="text-sm text-gray-500">
                  {selectedEmployeeIds.size ? `${selectedEmployeeIds.size} sélectionné(s)` : 'Tous'}
                </span>
                <svg className={`w-4 h-4 ${showDropdown ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.25 7.5l4.5 4.5 4.5-4.5" />
                </svg>
              </button>

              {showDropdown && hasItems && (
                <div className="absolute right-0 z-50 mt-2 w-[28rem] bg-white border rounded-2xl shadow-2xl p-4">
                  <div className="sticky top-0 bg-white pb-3">
                    <input
                      value={employeeQuery}
                      onChange={e => setEmployeeQuery(e.target.value)}
                      placeholder="Rechercher un employé…"
                      className="w-full h-10 border rounded-lg px-3 outline-none focus:ring"
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        className="text-xs px-3 py-2 border rounded-lg"
                        onClick={() => setSelectedEmployeeIds(new Set(employees.map(e => e.id)))}
                      >Tout sélectionner</button>
                      <button
                        className="text-xs px-3 py-2 border rounded-lg"
                        onClick={() => setSelectedEmployeeIds(new Set())}
                      >Effacer</button>
                      <button
                        className="text-xs px-3 py-2 border rounded-lg"
                        onClick={() => {
                          const all = new Set(employees.map(e => e.id));
                          const next = new Set();
                          for (const id of all) if (!selectedEmployeeIds.has(id)) next.add(id);
                          setSelectedEmployeeIds(next);
                        }}
                      >Inverser</button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-auto mt-2 space-y-1">
                    {visibleEmployees.map(emp => {
                      const checked = selectedEmployeeIds.has(emp.id);
                      return (
                        <label key={emp.id} className="flex items-center gap-3 cursor-pointer px-2 py-2 rounded-lg hover:bg-gray-50">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={checked}
                            onChange={(e) => {
                              const next = new Set(selectedEmployeeIds);
                              if (e.target.checked) next.add(emp.id);
                              else next.delete(emp.id);
                              setSelectedEmployeeIds(next);
                            }}
                          />
                          <span className="text-sm">{emp.name}</span>
                        </label>
                      );
                    })}
                    {!visibleEmployees.length && (
                      <div className="text-xs text-gray-500 px-2 py-1">Aucun résultat</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!hasItems && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded">
              Filtre employé désactivé : la réponse API ne contient pas <code>items</code>.{" "}
              Demandez au backend de renvoyer un tableau{" "}
              <code>{`[{ employeeId, employeeName, sentiment, topic, emotion }]`}</code>{" "}
              pour activer le filtrage par employé côté front.
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 space-y-20">
        {/* KPI total messages */}
        {charts?.sentimentDistributionData && (
          <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-8 flex flex-col items-center text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                {charts.sentimentDistributionData.datasets[0].counts.reduce((sum, c) => sum + c, 0).toLocaleString()}
              </h2>
              <p className="text-gray-500">Analysed messages</p>
            </div>
          </div>
        )}

        {/* Donut sentiments */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-fit mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-6">
            Emotion repartition
          </h3>
          <div className="flex justify-center items-center">
            <div ref={donutContainerRef} className="flex justify-center items-center">
              <D3Chart
                data={charts?.sentimentDistributionData}
                options={{ plugins: { title: { display: false }, legend: { display: false } } }}
                width={400}
                height={350}
                chartType="donut"
                containerRef={donutContainerRef}
              />
            </div>
            <div className="flex flex-col space-y-3 ml-8">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }}></div>
                <span className="text-gray-700 font-medium text-sm">
                  Positif ({charts?.sentimentDistributionData?.datasets[0].counts[0]} - {charts?.sentimentDistributionData?.datasets[0].data[0].toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: 'rgba(99, 102, 241, 0.8)' }}></div>
                <span className="text-gray-700 font-medium text-sm">
                  Neutral ({charts?.sentimentDistributionData?.datasets[0].counts[1]} - {charts?.sentimentDistributionData?.datasets[0].data[1].toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}></div>
                <span className="text-gray-700 font-medium text-sm">
                  Negatif ({charts?.sentimentDistributionData?.datasets[0].counts[2]} - {charts?.sentimentDistributionData?.datasets[0].data[2].toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Topics + Emotions sur la même ligne */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Topics */}
          <div ref={topicContainerRef} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-full">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800">Topics Frequency</h3>
            </div>
            <div className="flex justify-center">
              {charts?.topicFrequencyData && charts.topicFrequencyData.labels.length > 0 ? (
                <D3Chart
                  data={charts.topicFrequencyData}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    plugins: { title: { display: false }, legend: { position: 'top' } },
                    scales: {
                      x: { beginAtZero: true, title: { display: true, text: 'Number of messages' } },
                      y: { title: { display: true, text: 'subjects' } },
                    },
                  }}
                  width={520}
                  height={Math.max(380, charts.topicFrequencyData.labels.length * 60 + 200)}
                  containerRef={topicContainerRef}
                />
              ) : (
                <div className="flex justify-center items-center h-80 w-full">
                  <p className="text-gray-500">No data</p>
                </div>
              )}
            </div>
            {charts?.topicFrequencyData?.labels?.length > 0 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowTopicPopup(true)}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 border-2 border-purple-700 px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 hover:border-purple-800 transition-all duration-150 flex items-center space-x-3 shadow-md font-medium min-w-60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                  <span>View all topics</span>
                </button>
              </div>
            )}
          </div>

          {/* Emotions */}
          <div ref={emotionContainerRef} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-full">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800"> Emotinal's frequencies</h3>
            </div>
            <div className="flex justify-center">
              {charts?.emotionFrequencyData && charts.emotionFrequencyData.labels.length > 0 ? (
                <D3Chart
                  data={charts.emotionFrequencyData}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    plugins: { title: { display: false }, legend: { position: 'top' } },
                    scales: {
                      x: { beginAtZero: true, title: { display: true, text: 'Nomber of messages' } },
                      y: { title: { display: true, text: 'Emotions' } },
                    },
                  }}
                  width={520}
                  height={Math.max(380, charts.emotionFrequencyData.labels.length * 60 + 200)}
                  containerRef={emotionContainerRef}
                />
              ) : (
                <div className="flex justify-center items-center h-80 w-full">
                  <p className="text-gray-500">Aucune donnée</p>
                </div>
              )}
            </div>
            {charts?.emotionFrequencyData?.labels?.length > 0 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowEmotionPopup(true)}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 border-2 border-purple-700 px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 hover:border-purple-800 transition-all duration-150 flex items-center space-x-3 shadow-md font-medium min-w-60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                  </svg>
                  <span>See all emotions</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* POPUP — Tous les sujets */}
        {showTopicPopup && (
          <div className="fixed top-24 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Tous les sujets</h3>
                <button onClick={() => setShowTopicPopup(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                  </svg>
                </button>
              </div>
              <div className="flex justify-center">
                {charts?.topicFrequencyData?.labels?.length ? (
                  <D3Chart
                    data={charts.topicFrequencyData}
                    options={{
                      indexAxis: 'y',
                      responsive: true,
                      plugins: { title: { display: true, text: 'All subjects', font: { size: 16 } }, legend: { position: 'top' } },
                      scales: {
                        x: { beginAtZero: true, title: { display: true, text: 'Nombre of messages' } },
                        y: { title: { display: true, text: 'Subjects' } },
                      },
                    }}
                    width={800}
                    height={charts.topicFrequencyData.labels.length * 60 + 200}
                    containerRef={topicContainerRef}
                  />
                ) : (
                  <div className="flex justify-center items-center h-80 w-full">
                    <p className="text-gray-500">No data</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* POPUP — Toutes les émotions */}
        {showEmotionPopup && (
          <div className="fixed top-24 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Toutes les émotions</h3>
                <button onClick={() => setShowEmotionPopup(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                  </svg>
                </button>
              </div>
              <div className="flex justify-center">
                {charts?.emotionFrequencyData?.labels?.length ? (
                  <D3Chart
                    data={charts.emotionFrequencyData}
                    options={{
                      indexAxis: 'y',
                      responsive: true,
                      plugins: { title: { display: true, text: 'Toutes les émotions', font: { size: 16 } }, legend: { position: 'top' } },
                      scales: {
                        x: { beginAtZero: true, title: { display: true, text: 'Number of messages' } },
                        y: { title: { display: true, text: 'Emotions' } },
                      },
                    }}
                    width={800}
                    height={charts.emotionFrequencyData.labels.length * 60 + 200}
                    containerRef={emotionContainerRef}
                  />
                ) : (
                  <div className="flex justify-center items-center h-80 w-full">
                    <p className="text-gray-500">No data</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MessageAnalyse;
