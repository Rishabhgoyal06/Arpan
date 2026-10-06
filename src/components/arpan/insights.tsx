import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { analyzeInsights } from '@/lib/arpan/ai';
import { Loader2, Leaf, Heart, Sprout, ArrowRight, Sparkles } from 'lucide-react';

const COLORS = ['var(--serve)', 'var(--serve-soft)', 'var(--primary)', 'var(--muted)'];

export function MindfulGraph({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['insights', userId],
    queryFn: () => analyzeInsights({ data: { userId } }),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-serve" />
        <p className="text-sm">Synthesizing your journey...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-[500px] text-sm text-destructive">
        Unable to load mindful insights.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden flex flex-col gap-0 max-w-5xl mx-auto py-8">
      
      {/* HEADER SECTION - EDITORIAL STYLE */}
      <div className="text-center pb-12 relative z-10 px-6">
        <div className="inline-flex items-center justify-center gap-2 mb-8">
          <span className="h-px w-8 bg-serve/30"></span>
          <span className="text-[10px] font-medium tracking-[0.2em] text-serve uppercase">
            Current Theme: {data.theme || 'Growing'}
          </span>
          <span className="h-px w-8 bg-serve/30"></span>
        </div>
        <h3 className="text-4xl md:text-5xl font-display text-foreground mb-6 font-normal tracking-tight">
          Reflections & Growth
        </h3>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
          {data.synthesis}
        </p>
      </div>

      {/* GENTLE INVITATIONS - FLOATING CARDS */}
      <div className="px-6 mb-16">
        <div className="flex items-center justify-center gap-3 mb-8 opacity-60">
          <ArrowRight size={14} className="text-serve" />
          <h4 className="text-[10px] font-medium tracking-[0.15em] text-foreground uppercase">Gentle Invitations</h4>
          <ArrowRight size={14} className="text-serve rotate-180" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {data.recommendations?.map((rec: string, i: number) => (
            <div key={i} className="bg-serve-soft/30 p-8 rounded-2xl text-sm md:text-base text-foreground leading-relaxed flex items-start gap-4 transition-transform hover:-translate-y-1 duration-300">
              <span className="mt-1 flex-shrink-0 text-serve"><Leaf size={18} strokeWidth={1.5} /></span>
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* GRAPHS SECTION - EDITORIAL SPREAD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-6 mb-16 max-w-5xl mx-auto items-center">
        {/* RADAR CHART */}
        <div className="flex flex-col items-center">
          <h4 className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground mb-8 uppercase text-center">Dimensions of Presence</h4>
          <div className="h-80 w-full max-w-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.dimensions}>
                <PolarGrid stroke="var(--border)" strokeOpacity={0.4} />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11, letterSpacing: '0.1em' }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar 
                  name="Resonance" 
                  dataKey="score" 
                  stroke="var(--serve)" 
                  strokeWidth={1.5} 
                  fill="var(--serve)" 
                  fillOpacity={0.15} 
                />
                <Tooltip 
                  formatter={() => [null, '']}
                  labelFormatter={(label) => label}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'transparent', borderRadius: '12px', fontSize: '12px', padding: '12px 16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                  itemStyle={{ display: 'none' }}
                  cursor={false}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground mb-8 uppercase text-center">How You Show Up</h4>
          <div className="h-72 w-full max-w-[400px] relative mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.modes}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={115}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.modes?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={['var(--serve)', 'var(--offer)', 'var(--support)', 'var(--ask)'][index % 4]} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'transparent', borderRadius: '12px', fontSize: '12px', padding: '8px 14px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  formatter={(value: any, name: any) => [null, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text for donut */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart size={24} className="text-muted-foreground opacity-20" strokeWidth={1} />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 px-4">
            {data.modes?.map((m: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ['var(--serve)', 'var(--offer)', 'var(--support)', 'var(--ask)'][i % 4] }}></span>
                {m.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TEACHINGS GAINED - MINIMALIST QUOTES */}
      <div className="px-6 py-16 bg-gradient-to-b from-transparent via-serve-soft/20 to-transparent">
        <h4 className="text-[10px] font-medium tracking-[0.2em] text-serve mb-12 uppercase text-center flex items-center justify-center gap-3">
          <Sparkles size={12} /> Teachings Gained
        </h4>
        <div className="max-w-3xl mx-auto space-y-12">
          {data.learnings?.map((learning: string, i: number) => (
            <div key={i} className="text-center">
              <p className="text-lg md:text-xl text-foreground leading-relaxed font-display text-balance">
                “{learning}”
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center pt-16 pb-8">
        <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/60">
          This space is for you. There is nothing to achieve, only to notice.
        </p>
      </div>
    </div>
  );
}
