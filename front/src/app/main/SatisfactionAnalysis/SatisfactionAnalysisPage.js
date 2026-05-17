import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';

// D3Chart component with improved null checks
const D3Chart = ({ data, options, width = 600, height = 400, chartType, containerRef }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: width || 600, height: height || 400 });

  function wrapText(textSelection, width) {
    textSelection.each(function () {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word;
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.2; // ems
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

    if (containerRef && containerRef.current && containerRef.current.offsetWidth) {
      try {
        const containerWidth = containerRef.current.offsetWidth - 32;
        if (containerWidth > 0) {
          calculatedWidth = Math.max(300, Math.min(containerWidth, 700));
        }

        if (options && options.indexAxis === 'y' && data && data.labels) {
          const minHeight = data.labels.length * 60 + 200;
          calculatedHeight = Math.max(minHeight, 400);
        }
      } catch (error) {
        console.warn('Error calculating container dimensions, using default values:', error);
        calculatedWidth = width || 600;
        calculatedHeight = height || 400;
      }
    }

    setDimensions(prev => ({
      width: Math.max(prev.width, calculatedWidth),
      height: Math.max(prev.height, calculatedHeight)
    }));
  }, [width, height, containerRef, options, data]);

  useEffect(() => {
    // Enhanced null checks
    if (!data) {
      console.warn('D3Chart: No data provided');
      return;
    }
    
    if (!data.datasets || !Array.isArray(data.datasets) || data.datasets.length === 0) {
      console.warn('D3Chart: No datasets provided or datasets is empty');
      return;
    }
    
    if (chartType !== 'donut' && (!data.labels || !Array.isArray(data.labels))) {
      console.warn('D3Chart: No labels provided for non-donut chart');
      return;
    }

    const actualWidth = dimensions.width;
    const actualHeight = dimensions.height;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    let leftMargin = 60;
    if (options && options.indexAxis === 'y' && data.labels) {
      const maxLabelLength = Math.max(...data.labels.map(label => label ? label.length : 0));
      leftMargin = Math.max(120, Math.min(actualWidth * 0.35, maxLabelLength * 6 + 40));
    }
    
    const margin = { top: 40, right: 20, bottom: 80, left: leftMargin };
    const innerWidth = actualWidth - margin.left - margin.right;
    const innerHeight = actualHeight - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    if (chartType === 'donut') {
      if (!data.datasets[0] || !data.datasets[0].data) {
        console.warn('D3Chart: No data in first dataset for donut chart');
        return;
      }

      const radius = Math.min(innerWidth, innerHeight) / 2;
      const pie = d3.pie().value(d => d);
      const arc = d3.arc().innerRadius(radius * 0.4).outerRadius(radius * 0.8);

      const pieData = pie(data.datasets[0].data);

      const arcs = g.selectAll(".arc")
        .data(pieData)
        .enter().append("g")
        .attr("class", "arc")
        .attr("transform", `translate(${innerWidth / 2}, ${innerHeight / 2})`);

      arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => (data.datasets[0].backgroundColor && data.datasets[0].backgroundColor[i]) || 'gray')
        .attr("stroke", 'white')
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
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
          
          const counts = data.datasets[0].counts;
          const count = counts ? counts[d.index] : '';
          const countText = count ? ` (${count} employé${count > 1 ? 's' : ''})` : '';
          const label = data.labels && data.labels[d.index] ? data.labels[d.index] : 'N/A';
          
          tooltip.html(`<strong>${label}</strong><br/>${d.data.toFixed(1)}%${countText}`)
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
        .text(d => `${d.data.toFixed(1)}%`);
        
    } else if (options && options.indexAxis === 'y') {
      if (!data.datasets[0] || !data.datasets[0].data) {
        console.warn('D3Chart: No data in first dataset for horizontal bar chart');
        return;
      }

      const xScale = d3.scaleLinear()
        .domain([0, options.scales?.x?.max || d3.max(data.datasets[0].data)])
        .range([0, innerWidth]);

      const yScale = d3.scaleBand()
        .domain(data.labels.map((_, i) => i))
        .range([0, innerHeight])
        .padding(0.2);

      const barsData = data.datasets[0].data.map((value, index) => ({
        value: value,
        index: index,
        label: data.labels[index]
      }));

      const bars = g.selectAll(".bar")
        .data(barsData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => yScale(d.index))
        .attr("width", d => xScale(d.value))
        .attr("height", yScale.bandwidth())
        .attr("fill", data.datasets[0].backgroundColor || 'steelblue')
        .attr("stroke", data.datasets[0].borderColor || 'navy')
        .attr("stroke-width", data.datasets[0].borderWidth || 1)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
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
            .html(`<strong>Cause :</strong> ${d.label}<br/><strong>nombre de réponses :</strong> ${d.value}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          d3.selectAll(".d3-tooltip").remove();
        });

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

      if (options.scales?.x?.title?.text) {
        g.append("text")
          .attr("transform", `translate(${innerWidth/2}, ${innerHeight + 35})`)
          .style("text-anchor", "middle")
          .style("font-size", "12px")
          .text(options.scales.x.title.text);
      }

      if (options.scales?.y?.title?.text) {
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
      if (!data.datasets[0] || !data.datasets[0].data) {
        console.warn('D3Chart: No data in first dataset for vertical bar chart');
        return;
      }

      const xScale = d3.scaleBand()
        .domain(data.labels)
        .range([0, innerWidth])
        .padding(0.2);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data.datasets[0].data) * 1.1])
        .range([innerHeight, 0]);

      g.selectAll(".bar")
        .data(data.datasets[0].data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(data.labels[i]))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d))
        .attr("fill", data.datasets[0].backgroundColor || 'steelblue')
        .attr("stroke", data.datasets[0].borderColor || 'navy')
        .attr("stroke-width", data.datasets[0].borderWidth || 1)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          const index = data.datasets[0].data.indexOf(d);
          const label = data.labels[index];
          const employeeCount = data.datasets[0].employeeCounts ? data.datasets[0].employeeCounts[index] : null;
          const count = data.datasets[0].counts ? data.datasets[0].counts[index] : null;
          
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
          
          let tooltipText;
          if (employeeCount) {
            tooltipText = `${label}: ${d.toFixed(1)}%<br/>(${employeeCount} employé${employeeCount > 1 ? 's' : ''})`;
          } else if (count) {
            tooltipText = `${label}: ${d.toFixed(1)}%<br/>(${count} employé${count > 1 ? 's' : ''})`;
          } else {
            tooltipText = `${label}: ${d.toFixed(1)}%`;
          }
          
          tooltip.html(tooltipText)
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

      g.append("g")
        .call(d3.axisLeft(yScale));

      if (options.scales?.y?.title?.text) {
        g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 40)
          .attr("x", 0 - (innerHeight / 2))
          .style("text-anchor", "middle")
          .text(options.scales.y.title.text);
      }

      if (options.scales?.x?.title?.text) {
        g.append("text")
          .attr("transform", `translate(${innerWidth/2}, ${innerHeight + 45})`)
          .style("text-anchor", "middle")
          .text(options.scales.x.title.text);
      }
    }

    if (options && options.plugins?.title?.text) {
      svg.append("text")
        .attr("x", actualWidth / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", options.plugins.title.font?.size || 16)
        .style("font-weight", "bold")
        .text(options.plugins.title.text);
    }

  }, [data, options, chartType, dimensions]);

  return <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full h-auto"></svg>;
};
const SatisfactionAnalysisPage = () => {
  const { questionnaireId } = useParams();
  const [loading, setLoading] = useState(true);
  const [rawResults, setRawResults] = useState(null);
  const [error, setError] = useState(null);
  const [globalSatisfactionData, setGlobalSatisfactionData] = useState(null);
  const [satisfactionCauseData, setSatisfactionCauseData] = useState(null);
  const [dissatisfactionCauseData, setDissatisfactionCauseData] = useState(null);
  const [satisfactionThreshold, setSatisfactionThreshold] = useState(60);
  const [showSatisfactionPopup, setShowSatisfactionPopup] = useState(false);
  const [showDissatisfactionPopup, setShowDissatisfactionPopup] = useState(false);
  
  const [selectedHRFilter, setSelectedHRFilter] = useState('age');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hrCrossData, setHrCrossData] = useState({
    ageData: null,
    genderData: null,
    jobTitleData: null,
    seniorityData: null,
    contractTypeData: null,
    departmentData: null
  });
  
  const donutContainerRef = useRef();
  const satisfactionContainerRef = useRef();
  const dissatisfactionContainerRef = useRef();
  const hrContainerRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const calculateSeniorityInMonths = (hireDate, currentDate) => {
    const hire = new Date(hireDate);
    const current = new Date(currentDate);
    
    let months = (current.getFullYear() - hire.getFullYear()) * 12;
    months -= hire.getMonth();
    months += current.getMonth();
    
    if (current.getDate() < hire.getDate()) {
      months--;
    }
    
    return Math.max(0, months);
  };

  const getSeniorityPeriod = (months) => {
    if (months < 6) return '0-6 mois';
    if (months < 12) return '6 mois - 1 an';
    if (months < 24) return '1-2 ans';
    if (months < 36) return '2-3 ans';
    if (months < 60) return '3-5 ans';
    if (months < 120) return '5-10 ans';
    return '10+ ans';
  };

  const getSeniorityOrder = (period) => {
    const order = {
      '0-6 mois': 1,
      '6 mois - 1 an': 2,
      '1-2 ans': 3,
      '2-3 ans': 4,
      '3-5 ans': 5,
      '5-10 ans': 6,
      '10+ ans': 7,
      'Inconnu': 8
    };
    return order[period] || 9;
  };

  const getAgePeriod = (ageYears) => {
    if (ageYears >= 18 && ageYears <= 25) return '18-25 ans';
    if (ageYears >= 26 && ageYears <= 35) return '26-35 ans';
    if (ageYears >= 36 && ageYears <= 45) return '36-45 ans';
    if (ageYears >= 46 && ageYears <= 55) return '46-55 ans';
    if (ageYears >= 56 && ageYears <= 65) return '56-65 ans';
    if (ageYears > 65) return '65+ ans';
    return 'Inconnu';
  };

  const getAgePeriodOrder = (period) => {
    const order = {
      '18-25 ans': 1,
      '26-35 ans': 2,
      '36-45 ans': 3,
      '46-55 ans': 4,
      '56-65 ans': 5,
      '65+ ans': 6,
      'Inconnu': 7
    };
    return order[period] || 8;
  };

const filterOptions = [
  { value: 'age', label: 'Satisfaction by Age Group', icon: '👥', type: 'bar' },
  { value: 'gender', label: 'Satisfaction by Gender', icon: '⚥', type: 'bar' },
  { value: 'jobTitle', label: 'Satisfaction by Job Title', icon: '💼', type: 'bar' },
  { value: 'seniority', label: 'Satisfaction by Seniority', icon: '📈', type: 'bar' },
  { value: 'contractType', label: 'Satisfaction by Contract Type', icon: '📄', type: 'bar' },
  { value: 'department', label: 'Performance by Department', icon: '🏢', type: 'bar' }
];

const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const processHRCrossData = async (data, headers) => {
    try {
      console.log('Processing HR cross data...');
      const ageScores = {};
      const genderScores = {};
      const jobTitleScores = {};
      const seniorityScores = {};
      const contractTypeScores = {};
      const departmentScores = {};

      const today = new Date();

      for (const result of data) {
        if (result.employeeId) {
          try {
            const empResponse = await fetch(`${API_URL}/employee/${result.employeeId}`, { headers });
            if (empResponse.ok) {
              const employee = await empResponse.json();
              const satisfaction = result['global_satisfaction_%'] || 0;

              console.log('Employee:', employee.id, 'Satisfaction:', satisfaction);

              if (employee.birthDate && satisfaction > 0) {
                try {
                  const birthDate = new Date(employee.birthDate);
                  
                  if (!isNaN(birthDate.getTime())) {
                    let ageYears = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                      ageYears--;
                    }
                    
                    console.log(`Employee ${employee.id}: age=${ageYears}, satisfaction=${satisfaction}`);
                    
                    if (ageYears >= 18 && ageYears <= 70) {
                      const agePeriod = getAgePeriod(ageYears);
                      
                      if (!ageScores[agePeriod]) {
                        ageScores[agePeriod] = { totalSatisfaction: 0, count: 0 };
                      }
                      ageScores[agePeriod].totalSatisfaction += satisfaction;
                      ageScores[agePeriod].count += 1;
                      
                      console.log(`Added to age period ${agePeriod}:`, { satisfaction, count: ageScores[agePeriod].count });
                    } else {
                      console.log('Âge hors limites:', ageYears);
                    }
                  } else {
                    console.warn('Date de naissance invalide:', employee.birthDate);
                  }
                } catch (dateError) {
                  console.error('Erreur de parsing de date:', dateError, employee.birthDate);
                }
              } else {
                console.log('Données manquantes - birthDate:', !!employee.birthDate, 'satisfaction:', satisfaction);
              }

              const gender = employee.gender || 'Inconnu';
              if (!genderScores[gender]) {
                genderScores[gender] = { totalSatisfaction: 0, count: 0 };
              }
              genderScores[gender].totalSatisfaction += satisfaction;
              genderScores[gender].count += 1;

              const jobTitle = employee.jobTitle || 'Inconnu';
              if (!jobTitleScores[jobTitle]) {
                jobTitleScores[jobTitle] = { totalSatisfaction: 0, count: 0 };
              }
              jobTitleScores[jobTitle].totalSatisfaction += satisfaction;
              jobTitleScores[jobTitle].count += 1;

              const departmentName = employee.departmentName || 'Département inconnu';
              if (!departmentScores[departmentName]) {
                departmentScores[departmentName] = { totalSatisfaction: 0, count: 0 };
              }
              departmentScores[departmentName].totalSatisfaction += satisfaction;
              departmentScores[departmentName].count += 1;

              const seniorityPeriod = employee.hireDate 
                ? getSeniorityPeriod(calculateSeniorityInMonths(employee.hireDate, today))
                : 'Inconnu';
              
              if (!seniorityScores[seniorityPeriod]) {
                seniorityScores[seniorityPeriod] = { totalSatisfaction: 0, count: 0 };
              }
              seniorityScores[seniorityPeriod].totalSatisfaction += satisfaction;
              seniorityScores[seniorityPeriod].count += 1;

              const contractType = employee.contractTypeName || 'Inconnu';
              if (!contractTypeScores[contractType]) {
                contractTypeScores[contractType] = { totalSatisfaction: 0, count: 0 };
              }
              contractTypeScores[contractType].totalSatisfaction += satisfaction;
              contractTypeScores[contractType].count += 1;
            }
          } catch (empError) {
            console.error(`Error fetching employee ${result.employeeId}:`, empError);
          }
        }
      }

      console.log('Final ageScores:', ageScores);
      console.log('Age periods found:', Object.keys(ageScores));

      const createBarChartData = (scores, label, color = 'rgba(139, 92, 246, 0.7)', sortByOrder = false, customSortFn = null) => {
        let sortedEntries;
        
        if (customSortFn) {
          sortedEntries = Object.entries(scores).sort(customSortFn);
        } else if (sortByOrder) {
          sortedEntries = Object.entries(scores).sort(([a], [b]) => {
            return getSeniorityOrder(a) - getSeniorityOrder(b);
          });
        } else {
          sortedEntries = Object.entries(scores).sort(([, a], [, b]) => (b.totalSatisfaction / b.count) - (a.totalSatisfaction / a.count));
        }
        
        const labels = sortedEntries.map(([key]) => key);
        const data = sortedEntries.map(([, score]) => score.totalSatisfaction / score.count);
        const counts = sortedEntries.map(([, score]) => score.count);

        return {
          labels,
          datasets: [{
            label,
            data,
            backgroundColor: color,
            borderColor: color.replace('0.7', '1'),
            borderWidth: 1,
            counts
          }]
        };
      };

      setHrCrossData({
        ageData: Object.keys(ageScores).length > 0 ? createBarChartData(
          ageScores, 
          'Satisfaction par Tranche d\'Âge', 
          'rgba(245, 158, 11, 0.7)', 
          false,
          ([a], [b]) => getAgePeriodOrder(a) - getAgePeriodOrder(b)
        ) : null,
        genderData: Object.keys(genderScores).length > 0 ? createBarChartData(genderScores, 'Satisfaction par Genre', 'rgba(139, 92, 246, 0.7)') : null,
        jobTitleData: Object.keys(jobTitleScores).length > 0 ? createBarChartData(jobTitleScores, 'Satisfaction par Poste', 'rgba(59, 130, 246, 0.7)') : null,
        seniorityData: Object.keys(seniorityScores).length > 0 ? createBarChartData(seniorityScores, 'Satisfaction par Ancienneté', 'rgba(6, 182, 212, 0.7)', true) : null,
        contractTypeData: Object.keys(contractTypeScores).length > 0 ? createBarChartData(contractTypeScores, 'Satisfaction par Type de Contrat', 'rgba(239, 68, 68, 0.7)') : null,
        departmentData: Object.keys(departmentScores).length > 0 ? createBarChartData(departmentScores, 'Performance par Département', 'rgba(99, 102, 241, 0.7)') : null
      });

      console.log('HR Cross Data set with age periods:', { ageDataLength: Object.keys(ageScores).length });

    } catch (error) {
      console.error('Error processing HR cross data:', error);
    }
  };


useEffect(() => {
  
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/results/questionnaire/${questionnaireId}`, { headers });
      if (!response.ok) throw new Error('Erreur lors de la récupération des résultats');
      const data = await response.json();
      setRawResults(data);
      // Pas besoin de calculer ici !
    } catch (err) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  if (questionnaireId) fetchData();
}, [questionnaireId]);

  useEffect(() => {
 //   if (!rawResults) return;
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAndProcessData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/results/questionnaire/${questionnaireId}`, { headers });
        if (!response.ok) throw new Error('Erreur lors de la récupération des résultats');

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Aucune donnée disponible pour ce questionnaire');
        }

        const satisfiedCount = data.filter(d => (d['global_satisfaction_%'] || 0) >= satisfactionThreshold).length;
        const unsatisfiedCount = data.length - satisfiedCount;
        const satisfiedPercentage = (satisfiedCount / data.length) * 100;
        const unsatisfiedPercentage = (unsatisfiedCount / data.length) * 100;
        
        setGlobalSatisfactionData({
          labels: ['Satisfait', 'Non Satisfait'],
          datasets: [{
            label: 'Répartition de la Satisfaction (%)',
            data: [satisfiedPercentage, unsatisfiedPercentage],
            backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
            borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
            borderWidth: 2,
            counts: [satisfiedCount, unsatisfiedCount]
          }]
        });

        const satisfactionMap = extractCauses(data, 'satisfaction_causes');
        const dissatisfactionMap = extractCauses(data, 'dissatisfaction_causes');
        
        setSatisfactionCauseData(createCauseChartData(satisfactionMap, 'Causes de Satisfaction', 'rgba(16, 185, 129, 0.7)'));
        setDissatisfactionCauseData(createCauseChartData(dissatisfactionMap, 'Causes d\'Insatisfaction', 'rgba(239, 68, 68, 0.7)'));
        
        await processHRCrossData(data, headers);
        
      } catch (err) {
        console.error(err);
        setError(err.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    if (questionnaireId) {
      fetchAndProcessData();
    }
  }, [questionnaireId, satisfactionThreshold]);

  const extractCauses = (dataArray, key) => {
    const map = {};
    dataArray.forEach(item => {
      const raw = item[key];
      if (raw) {
        const matches = raw.matchAll(/(.+?)\s*\(Score: \d+\.\d\/\d+\)/g);
        for (const match of matches) {
          const cause = match[1].trim();
          if (cause) map[cause] = (map[cause] || 0) + 1;
        }
      }
    });
    return map;
  };

  const createCauseChartData = (map, label, color) => {
    const sortedEntries = Object.entries(map).sort(([, a], [, b]) => b - a);
    const labels = sortedEntries.map(([key]) => key);
    const data = sortedEntries.map(([, value]) => value);
    
    return {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: color,
        borderColor: color.replace('0.7', '1'),
        borderWidth: 1,
      }],
    };
  };

  const getCurrentHRData = () => {
    return hrCrossData[selectedHRFilter + 'Data'];
  };

  const getCurrentHROptions = () => {
    const currentOption = filterOptions.find(opt => opt.value === selectedHRFilter);
    
    const baseOptions = {
      responsive: true,
      plugins: {
        title: { 
          display: true, 
          text: currentOption.label, 
          font: { size: 16 } 
        },
        legend: { position: 'top' }
      },
      scales: {
        y: { 
          title: { display: true, text: 'Satisfaction score (%)' }, 
          beginAtZero: true, 
          max: 100 
        },
        x: { 
          title: { display: true, text: currentOption.label.replace('Satisfaction par ', '').replace('Performance par ', '') } 
        }
      }
    };

    return baseOptions;
  };

  const getCurrentHRChartType = () => {
    return 'bar';
  };

  const getHRStats = () => {
    const data = getCurrentHRData();
    if (!data) return null;

    const counts = data.datasets[0].counts || [];
    const totalEmployees = counts.reduce((sum, count) => sum + count, 0);
    const avgSatisfaction = data.datasets[0].data.reduce((sum, score) => sum + score, 0) / data.datasets[0].data.length;
    const maxCategory = data.labels[data.datasets[0].data.indexOf(Math.max(...data.datasets[0].data))];
    
    return {
      totalEmployees,
      avgSatisfaction: avgSatisfaction.toFixed(1),
      maxCategory,
      categories: data.labels.length
    };
  };

  const causeChartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      title: { display: true, text: '', font: { size: 16 } },
      legend: { position: 'top' }
    },
    scales: {
      x: { beginAtZero: true, title: { display: true, text: 'Nombre de réponses' } },
      y: { title: { display: true, text: 'Causes' } },
    },
  };

  const hrStats = getHRStats();

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
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Satisfaction
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Analyse complète des résultats {questionnaireId && `- Questionnaire #${questionnaireId}`}
              </p>
            </div>
           
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-32"> {/* Espace vertical très augmenté */}
        {globalSatisfactionData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h4a1 1 0 100-2H9z"/>
                    <path d="M13 4a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h6z"/>
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {globalSatisfactionData.datasets[0].counts[0] + globalSatisfactionData.datasets[0].counts[1]}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Total</div>
                </div>
              </div>
              <div className="text-gray-600 text-sm">Total Employees</div>
              <div className="text-xs text-gray-500 mt-1">Analyzed Questionnaire</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">
                    {globalSatisfactionData.datasets[0].counts[0]}
                  </div>
                  <div className="text-sm text-emerald-600 font-medium">
                    {globalSatisfactionData.datasets[0].data[0].toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="text-gray-600 text-sm">Satisfied Employees</div>
              <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${globalSatisfactionData.datasets[0].data[0]}%`}}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">
                    {globalSatisfactionData.datasets[0].counts[1]}
                  </div>
                  <div className="text-sm text-red-600 font-medium">
                    {globalSatisfactionData.datasets[0].data[1].toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="text-gray-600 text-sm">Unsatisfied Employees</div>
              <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${globalSatisfactionData.datasets[0].data[1]}%`}}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
  <div className="flex items-center justify-between mb-4">
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </div>
    <div className="text-right">
      {/* Select threshold value here */}
      <select
        value={satisfactionThreshold}
        onChange={(e) => setSatisfactionThreshold(Number(e.target.value))}
        className="text-2xl font-bold text-purple-600 bg-transparent outline-none px-2 py-1 rounded border border-purple-300 focus:ring-2 focus:ring-purple-400"
      >
        {[30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 190].map((threshold) => (
          <option key={threshold} value={threshold}>{threshold}%</option>
        ))}
      </select>
    </div>
  </div>
  <div className="text-gray-600 text-sm font-semibold">Threshold</div>
  <div className="text-xs text-gray-500 mt-1">Satisfaction Criteria</div>
</div></div>

        )}

        {/* Espacement très accru entre les KPIs et le premier graphique */}
       {/* --- Donut section --- */}
{globalSatisfactionData ? (
  <div className="mt-24">
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-fit mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-6">
        Employees Satisfaction Distribution
      </h3>
      <div className="flex flex-row gap-10 justify-center items-center">
        {/* Donut Chart */}
        <div ref={donutContainerRef} className="flex justify-center items-center">
          <D3Chart
            data={globalSatisfactionData}
            options={{ plugins: { title: { display: false }, legend: { display: false } } }}
            width={400}
            height={350}
            chartType="donut"
            containerRef={donutContainerRef}
          />
        </div>

        {/* Légende */}
        <div className="flex flex-col gap-8 min-w-[270px]">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }} />
              <span className="text-gray-700 font-medium text-sm">
                Satisfied (
                {globalSatisfactionData.datasets[0].counts[0]} - {globalSatisfactionData.datasets[0].data[0].toFixed(1)}%
                )
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }} />
              <span className="text-gray-700 font-medium text-sm">
                Unsatisfied (
                {globalSatisfactionData.datasets[0].counts[1]} - {globalSatisfactionData.datasets[0].data[1].toFixed(1)}%
                )
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
) : (
  // Fallback (optionnel)
  <div className="mt-24">
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-fit mx-auto text-gray-500">
      Aucune donnée pour la répartition (encore en chargement).
    </div>
  </div>
)}


        {/* Espacement très accru entre les graphiques */}
        <div className="mt-32 space-y-32"> {/* Espace vertical très augmenté */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="flex justify-center">
              <div ref={satisfactionContainerRef} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-fit">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Top 5 Satisfaction Causes
                  </h3>
                </div>
                <div className="flex justify-center">
                  {satisfactionCauseData && satisfactionCauseData.labels.length > 0 ? (
                    <D3Chart 
                      data={{
                        labels: satisfactionCauseData.labels.slice(0, 5),
                        datasets: [{
                          ...satisfactionCauseData.datasets[0],
                          data: satisfactionCauseData.datasets[0].data.slice(0, 5)
                        }]
                      }} 
                      options={{ 
                        ...causeChartOptions, 
                        plugins: { 
                          ...causeChartOptions.plugins, 
                          title: { display: false } 
                        }
                      }} 
                      width={500} 
                      height={300}
                      containerRef={satisfactionContainerRef}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-80 w-96">
                      <p className="text-gray-500">Aucune donnée disponible</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setShowSatisfactionPopup(true)}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 border-2 border-purple-700 px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 hover:border-purple-800 transition-all duration-150 flex items-center space-x-3 shadow-md font-medium min-w-80 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    <span>Voir toutes les causes de satisfaction</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div ref={dissatisfactionContainerRef} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-fit">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Top 5 dissatisfaction Causes
                  </h3>
                </div>
                <div className="flex justify-center">
                  {dissatisfactionCauseData && dissatisfactionCauseData.labels.length > 0 ? (
                    <D3Chart 
                      data={{
                        labels: dissatisfactionCauseData.labels.slice(0, 5),
                        datasets: [{
                          ...dissatisfactionCauseData.datasets[0],
                          data: dissatisfactionCauseData.datasets[0].data.slice(0, 5)
                        }]
                      }} 
                      options={{ 
                        ...causeChartOptions, 
                        plugins: { 
                          ...causeChartOptions.plugins, 
                          title: { display: false } 
                        }
                      }} 
                      width={500} 
                      height={300}
                      containerRef={dissatisfactionContainerRef}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-80 w-96">
                      <p className="text-gray-500">Aucune donnée disponible</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setShowDissatisfactionPopup(true)}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 border-2 border-purple-700 px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 hover:border-purple-800 transition-all duration-150 flex items-center space-x-3 shadow-md font-medium min-w-80 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                    </svg>
                    <span>Voir toutes les causes d'insatisfaction</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showSatisfactionPopup && (
            <div className="fixed top-24 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Toutes les Causes de Satisfaction
                  </h3>
                  <button
                    onClick={() => setShowSatisfactionPopup(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-center">
                  {satisfactionCauseData && satisfactionCauseData.labels.length > 0 ? (
                    <D3Chart 
                      data={satisfactionCauseData} 
                      options={{ 
                        ...causeChartOptions, 
                        plugins: { 
                          ...causeChartOptions.plugins, 
                          title: { display: true, text: 'Toutes les Causes de Satisfaction' } 
                        }
                      }} 
                      width={800} 
                      height={satisfactionCauseData.labels.length * 60 + 200}
                      containerRef={satisfactionContainerRef}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-80 w-full">
                      <p className="text-gray-500">Aucune donnée disponible</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showDissatisfactionPopup && (
            <div className="fixed top-24 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Toutes les Causes d'Insatisfaction
                  </h3>
                  <button
                    onClick={() => setShowDissatisfactionPopup(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-center">
                  {dissatisfactionCauseData && dissatisfactionCauseData.labels.length > 0 ? (
                    <D3Chart 
                      data={dissatisfactionCauseData} 
                      options={{ 
                        ...causeChartOptions, 
                        plugins: { 
                          ...causeChartOptions.plugins, 
                          title: { display: true, text: 'Toutes les Causes d\'Insatisfaction' } 
                        }
                      }} 
                      width={800} 
                      height={dissatisfactionCauseData.labels.length * 60 + 200}
                      containerRef={dissatisfactionContainerRef}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-80 w-full">
                      <p className="text-gray-500">Aucune donnée disponible</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Espacement très accru avant la section RH */}
  
        <div className="space-y-10">    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">HR Analysis</h3>
            </div>

            <div className="mb-8">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 border-2 border-purple-700 px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 hover:border-purple-800 transition-all duration-150 flex items-center space-x-3 shadow-md font-medium min-w-80 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Choose a chart</span>
                  <span className="text-sm text-purple-800 font-medium flex-1 text-left bg-white px-2 py-1 rounded">
                    {filterOptions.find((opt) => opt.value === selectedHRFilter)?.label || 'Select an option'}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-2xl border-2 border-purple-200 z-50 overflow-hidden">
                    <div className="py-2">
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedHRFilter(option.value);
                            setShowDropdown(false);
                          }}
                          className={`w-full px-6 py-4 text-left hover:bg-purple-50 ${
                            selectedHRFilter === option.value 
                              ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-600' 
                              : 'text-gray-800 hover:text-purple-700'
                          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                        >
                          <span className="text-xl">{option.icon}</span>
                          <span className="flex-1 text-base">{option.label}</span>
                          {selectedHRFilter === option.value && (
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {hrStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"> {/* Marge bottom très augmentée */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{hrStats.totalEmployees}</div>
                      <div className="text-sm text-blue-600 font-medium">Employees</div>
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm">Total analyzed</div>
                  <div className="text-xs text-gray-500 mt-1">For this category</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">{hrStats.avgSatisfaction}%</div>
                      <div className="text-sm text-emerald-600 font-medium">Average</div>
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm">Average satisfaction</div>
                  <div className="text-xs text-gray-500 mt-1">For this category</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-600">{hrStats.maxCategory}</div>
                      <div className="text-sm text-amber-600 font-medium">Highest score</div>
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm">Most satisfied category</div>
                  <div className="text-xs text-gray-500 mt-1">In this analyse</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{hrStats.categories}</div>
                      <div className="text-sm text-purple-600 font-medium">Categories</div>
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm">Number of subcategories</div>
                  <div className="text-xs text-gray-500 mt-1">In this analyse</div>
                </div>
              </div>
            )} <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
               </div> <div className="flex justify-center">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-inner w-fit">
             

            <div ref={hrContainerRef} className="flex items-center justify-center">
              {getCurrentHRData() ? (
                <D3Chart 
                  data={getCurrentHRData()} 
                  options={getCurrentHROptions()} 
                  width={700} 
                  height={400}
                  chartType={getCurrentHRChartType()}
                  containerRef={hrContainerRef}
                />
              ) : (
                <div className="text-center text-gray-500 p-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
                  </svg>
                  <p className="text-lg">No data available for this analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatisfactionAnalysisPage;