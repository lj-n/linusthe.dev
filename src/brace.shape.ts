const data = [
  -0.44845327734947205, -0.12000006437301636, -0.3908143937587738,
  -0.12377782166004181, -0.3405921459197998, -0.1349722445011139,
  -0.29732826352119446, -0.15337501466274261, -0.2605643570423126,
  -0.178777813911438, -0.22984212636947632, -0.21097227931022644,
  -0.20470324158668518, -0.2497500479221344, -0.18468935787677765,
  -0.2949028015136719, -0.16934213042259216, -0.3462222218513489,
  -0.15820325911045074, -0.4034999907016754, -0.15081435441970825,
  -0.4665277600288391, -0.1467171460390091, -0.5350971817970276,
  -0.14545324444770813, -0.6090000867843628, -0.14545324444770813,
  -0.8730001449584961, -0.1432015299797058, -0.956611156463623,
  -0.13618938624858856, -1.0333889722824097, -0.12403137981891632,
  -1.1032500267028809, -0.1063421219587326, -1.1661112308502197,
  -0.08273622393608093, -1.2218890190124512, -0.05282825231552124,
  -1.2705000638961792, -0.016232773661613464, -1.3118611574172974,
  0.02743564546108246, -1.3458889722824097, 0.07856239378452301,
  -1.3725000619888306, 0.13753290474414825, -1.391611099243164,
  0.20473256707191467, -1.4031388759613037, 0.28054681420326233,
  -1.4070000648498535, 0.3975467383861542, -1.4070000648498535,
  0.3975467383861542, -1.1790001392364502, 0.3525467813014984,
  -1.1790001392364502, 0.30347388982772827, -1.1777935028076172,
  0.26096346974372864, -1.1738473176956177, 0.22457805275917053,
  -1.1666719913482666, 0.1938801258802414, -1.1557778120040894,
  0.16843222081661224, -1.14067542552948, 0.14779677987098694,
  -1.1208751201629639, 0.13153637945652008, -1.0958871841430664,
  0.11921346187591553, -1.0652222633361816, 0.1103905588388443,
  -1.028390645980835, 0.10463015735149384, -0.9849028587341309,
  0.10149474442005157, -0.9342691898345947, 0.10054676234722137,
  -0.8760000467300415, 0.10054676234722137, -0.6600000858306885,
  0.09882281720638275, -0.5637691617012024, 0.09350511431694031,
  -0.47715282440185547, 0.08437491953372955, -0.39951568841934204,
  0.07121345400810242, -0.33022230863571167, 0.05380198359489441,
  -0.2686372399330139, 0.03192177414894104, -0.21412508189678192,
  0.005354046821594238, -0.16605041921138763, -0.026119932532310486,
  -0.12377786636352539, -0.06271889805793762, -0.08667196333408356,
  -0.10466162860393524, -0.05409729480743408, -0.15216685831546783,
  -0.025418490171432495, -0.20545324683189392, -8.940696716308594e-8,
  -0.15216681361198425, 0.02541831135749817, -0.10466158390045166,
  0.054097115993499756, -0.06271889805793762, 0.08667173981666565,
  -0.026119932532310486, 0.1237775981426239, 0.005354002118110657,
  0.16605019569396973, 0.03192168474197388, 0.214124858379364,
  0.053801894187927246, 0.2686370015144348, 0.07121331989765167,
  0.3302220404148102, 0.08437478542327881, 0.3995154798030853,
  0.09350498020648956, 0.47715264558792114, 0.098822683095932,
  0.5637689828872681, 0.10054676234722137, 0.6599999666213989,
  0.10054676234722137, 0.875999927520752, 0.101494699716568, 0.9342689514160156,
  0.10463011264801025, 0.9849026203155518, 0.11039051413536072,
  1.0283905267715454, 0.11921341717243195, 1.0652220249176025,
  0.1315363347530365, 1.0958870649337769, 0.14779673516750336,
  1.1208748817443848, 0.16843213140964508, 1.1406753063201904,
  0.19388003647327423, 1.1557776927947998, 0.22457796335220337,
  1.1666717529296875, 0.2609633803367615, 1.1738470792770386,
  0.3034738004207611, 1.177793264389038, 0.3525467813014984, 1.178999900817871,
  0.3975467383861542, 1.178999900817871, 0.3975467383861542, 1.4070000648498535,
  0.28054681420326233, 1.4070000648498535, 0.20473256707191467,
  1.4031388759613037, 0.13753290474414825, 1.391611099243164,
  0.07856239378452301, 1.3725000619888306, 0.02743564546108246,
  1.3458889722824097, -0.016232773661613464, 1.3118611574172974,
  -0.05282825231552124, 1.2705000638961792, -0.08273622393608093,
  1.2218890190124512, -0.1063421219587326, 1.1661112308502197,
  -0.12403133511543274, 1.1032500267028809, -0.1361892968416214,
  1.0333888530731201, -0.14320144057273865, 0.956611156463623,
  -0.14545324444770813, 0.872999906539917, -0.14545324444770813,
  0.6089999675750732, -0.1467171460390091, 0.5350971221923828,
  -0.15081435441970825, 0.46652770042419434, -0.15820324420928955,
  0.40349990129470825, -0.16934211552143097, 0.3462221324443817,
  -0.18468934297561646, 0.2949027121067047, -0.2047032117843628,
  0.24974995851516724, -0.22984211146831512, 0.21097218990325928,
  -0.26056432723999023, 0.17877772450447083, -0.29732823371887207,
  0.15337496995925903, -0.3405921459197998, 0.13497215509414673,
  -0.3908143639564514, 0.12377768754959106, -0.44845327734947205,
  0.1199999749660492,
];
export default new Float32Array(data);