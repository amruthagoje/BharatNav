from typing import Dict, List
from app.models.scenario import ScenarioConfig, InitialAgentConfig
from app.models.object_types import ObjectClass, BehaviorProfile


SCENARIOS: Dict[str, ScenarioConfig] = {
    "scenario_1": ScenarioConfig(
        id="scenario_1",
        name="Unmarked Village Road",
        description="Narrow unstriped village road with oncoming motorcycle, walking cattle, and erratic auto-rickshaw.",
        road_type="Unmarked Village Road",
        road_width=7.0,
        road_length=120.0,
        ego_start_speed=8.0,
        target_speed=10.0,
        agents=[
            InitialAgentConfig(
                id="MOTO_01",
                object_class=ObjectClass.MOTORCYCLE,
                x=35.0,
                y=-1.5,
                vx=-6.0,
                vy=0.2,
                heading=3.1415,
                behavior=BehaviorProfile.AGGRESSIVE
            ),
            InitialAgentConfig(
                id="CATTLE_01",
                object_class=ObjectClass.ANIMAL,
                x=22.0,
                y=2.5,
                vx=0.0,
                vy=-0.4,
                heading=-1.57,
                behavior=BehaviorProfile.UNPREDICTABLE,
                trigger_time=2.0
            ),
            InitialAgentConfig(
                id="AUTO_01",
                object_class=ObjectClass.AUTO_RICKSHAW,
                x=45.0,
                y=1.0,
                vx=-3.0,
                vy=-0.3,
                heading=3.1415,
                behavior=BehaviorProfile.ERRATIC
            )
        ]
    ),
    "scenario_2": ScenarioConfig(
        id="scenario_2",
        name="Busy Unsignalized Urban Intersection",
        description="Complex 4-way unsignalized junction with multi-directional cross traffic and pedestrians.",
        road_type="Urban Intersection",
        road_width=10.0,
        road_length=100.0,
        ego_start_speed=8.3,
        target_speed=11.0,
        agents=[
            InitialAgentConfig(
                id="AUTO_01",
                object_class=ObjectClass.AUTO_RICKSHAW,
                x=25.0,
                y=-4.0,
                vx=1.0,
                vy=4.0,
                heading=1.57,
                behavior=BehaviorProfile.ERRATIC
            ),
            InitialAgentConfig(
                id="CAR_02",
                object_class=ObjectClass.CAR,
                x=30.0,
                y=5.0,
                vx=-2.0,
                vy=-3.5,
                heading=-1.57,
                behavior=BehaviorProfile.NORMAL
            ),
            InitialAgentConfig(
                id="PED_01",
                object_class=ObjectClass.PEDESTRIAN,
                x=20.0,
                y=-3.5,
                vx=0.5,
                vy=1.2,
                heading=1.2,
                behavior=BehaviorProfile.CAUTIOUS,
                trigger_time=1.5
            )
        ]
    ),
    "scenario_3": ScenarioConfig(
        id="scenario_3",
        name="Highway Merge",
        description="AV merging into high-speed traffic stream with heavy trucks and fast overtaking vehicles.",
        road_type="Highway Ramp",
        road_width=12.0,
        road_length=150.0,
        ego_start_speed=15.0,
        target_speed=20.0,
        agents=[
            InitialAgentConfig(
                id="TRUCK_01",
                object_class=ObjectClass.TRUCK,
                x=30.0,
                y=0.0,
                vx=12.0,
                vy=0.0,
                heading=0.0,
                behavior=BehaviorProfile.NORMAL
            ),
            InitialAgentConfig(
                id="CAR_FAST",
                object_class=ObjectClass.CAR,
                x=10.0,
                y=3.5,
                vx=22.0,
                vy=0.0,
                heading=0.0,
                behavior=BehaviorProfile.AGGRESSIVE
            )
        ]
    ),
    "scenario_4": ScenarioConfig(
        id="scenario_4",
        name="Dense Market Area",
        description="Slow micro-navigation through dense market with pushcarts, pedestrians, and double-parked autos.",
        road_type="Market Street",
        road_width=6.5,
        road_length=80.0,
        ego_start_speed=5.0,
        target_speed=6.0,
        agents=[
            InitialAgentConfig(
                id="PUSHCART_01",
                object_class=ObjectClass.PUSHCART,
                x=18.0,
                y=0.8,
                vx=0.8,
                vy=-0.1,
                heading=0.0,
                behavior=BehaviorProfile.CAUTIOUS
            ),
            InitialAgentConfig(
                id="PED_01",
                object_class=ObjectClass.PEDESTRIAN,
                x=14.0,
                y=-1.5,
                vx=0.2,
                vy=0.9,
                heading=1.57,
                behavior=BehaviorProfile.UNPREDICTABLE
            ),
            InitialAgentConfig(
                id="PED_02",
                object_class=ObjectClass.PEDESTRIAN,
                x=22.0,
                y=1.8,
                vx=-0.3,
                vy=-0.8,
                heading=-1.57,
                behavior=BehaviorProfile.NORMAL
            ),
            InitialAgentConfig(
                id="AUTO_PARKED",
                object_class=ObjectClass.AUTO_RICKSHAW,
                x=26.0,
                y=-1.8,
                vx=0.0,
                vy=0.0,
                heading=0.0,
                behavior=BehaviorProfile.NORMAL
            )
        ]
    ),
    "scenario_5": ScenarioConfig(
        id="scenario_5",
        name="Sudden Cattle Crossing",
        description="Cruising vehicle encounters sudden cattle stepping into road at close range, triggering emergency replan.",
        road_type="Suburban Highway",
        road_width=8.0,
        road_length=120.0,
        ego_start_speed=11.11,
        target_speed=11.11,
        agents=[
            InitialAgentConfig(
                id="CATTLE_BOSS",
                object_class=ObjectClass.ANIMAL,
                x=32.0,
                y=3.5,
                vx=-0.2,
                vy=-1.6,  # Rapidly steps across road
                heading=-1.57,
                behavior=BehaviorProfile.UNPREDICTABLE,
                trigger_time=1.0
            ),
            InitialAgentConfig(
                id="CAR_ONCOMING",
                object_class=ObjectClass.CAR,
                x=55.0,
                y=-2.0,
                vx=-8.0,
                vy=0.0,
                heading=3.1415,
                behavior=BehaviorProfile.NORMAL
            )
        ]
    )
}
